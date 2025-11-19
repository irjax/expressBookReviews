const express = require("express");
const {
  getBooks,
  getBookById,
  getBookByAuthor,
  getBookByTitle,
} = require("./booksdb.js");
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
public_users.get("/", async (req, res) => {
  try {
    const books = await getBooks();
    res.send(JSON.stringify({ books }, null, 4));
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;

  try {
    // Retrieve books object associated with isbn
    const book = await getBookById(isbn);
    if (book) {
      // Send a JSON response containing the books array, formatted with an indentation of 4 spaces for readability
      res.send(JSON.stringify({ book }, null, 4));
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  const author = req.params.author;

  try {
    // Retrieve books object associated with author
    const book = await getBookByAuthor(author);
    if (book) {
      // Send a JSON response containing the books array, formatted with an indentation of 4 spaces for readability
      res.send(JSON.stringify({ book }, null, 4));
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
  const title = req.params.title;

  try {
    // Retrieve books object associated with title
    const book = await getBookByTitle(title);
    if (book) {
      // Send a JSON response containing the books array, formatted with an indentation of 4 spaces for readability
      res.send(JSON.stringify({ book }, null, 4));
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
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
