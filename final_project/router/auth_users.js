const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const newReview = req.params.review;
  // Retrieve books object associated with isbn
  const book = books[isbn];
  if (book) {
    let bookReviews = book["reviews"];

    let matchedReview = false;
    if (bookReviews.length > 0) {
      for (const review of bookReviews) {
        if (review.username == username) {
          matchedReview = true;
          review.review = newReview;
          break;
        }
      }
    }
    if (!matchedReview) {
      // Add review
      book["reviews"].push({
        username: username,
        review: newReview,
      });
    }
  }

  return res.send(`Review added: \n${JSON.stringify({ book }, null, 4)}`);
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  // Retrieve books object associated with isbn
  const book = books[isbn];
  // If there is a book with that isbn
  if (book) {
    // Get the reviews for that book
    let bookReviews = book["reviews"];
    // If there are reviews for that book
    if (bookReviews.length > 0) {
      // Find the review for the book by that username
      let filtered_reviews = bookReviews.filter(
        (review) => review.username === username
      );
      // If there is a review by that username
      if (filtered_reviews.length > 0) {
        // Delete the review by that username
        bookReviews = bookReviews.filter(
          (review) => review.username !== username
        );
        return res.send(`Review for ${book.title} by ${username} deleted`);
      } else {
        // There is no review by that username
        return res.send("Review not found");
      }
    } else {
      return res.send("No reviews for that book");
    }
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
