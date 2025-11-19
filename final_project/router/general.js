const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  // Send a JSON response containing the books array, formatted with an indentation of 4 spaces for readability
  return res.send(JSON.stringify({ books }, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  // Retrieve books object associated with isbn
  let book = books[isbn];
  return res.send(JSON.stringify({ book }, null, 4));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  // Retrieve books object associated with author
  // 1-Obtain all the keys for the ‘books’ object
  const booksKeys = Object.keys(books);
  let matchedKey = -1;
  // 2-Iterate through the ‘books’ array & check the author matches the one provided in the request parameters.
  for (const key of booksKeys) {
    if (books[key].author == author) {
      matchedKey = key;
      break;
    }
  }
  if (matchedKey != -1) {
    const matchedAuthor = books[matchedKey];
    return res.send(JSON.stringify({ matchedAuthor }, null, 4));
  } else {
    return res.send("Author not found");
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  // Retrieve books object associated with title
  // 1-Obtain all the keys for the ‘books’ object
  const booksKeys = Object.keys(books);
  let matchedKey = -1;
  // 2-Iterate through the ‘books’ array & check the author matches the one provided in the request parameters.
  for (const key of booksKeys) {
    if (books[key].title == title) {
      matchedKey = key;
      break;
    }
  }
  if (matchedKey != -1) {
    const matchedTitle = books[matchedKey];
    return res.send(JSON.stringify({ matchedTitle }, null, 4));
  } else {
    return res.send("Title not found");
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  // Retrieve books object associated with isbn
  return res.send(
    JSON.stringify(
      {
        author: books[isbn].author,
        title: books[isbn].title,
        reviews: books[isbn].reviews,
      },
      null,
      4
    )
  );
});

module.exports.general = public_users;
