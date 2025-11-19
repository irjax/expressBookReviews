let books = {
  1: { author: "Chinua Achebe", title: "Things Fall Apart", reviews: [] },
  2: {
    author: "Hans Christian Andersen",
    title: "Fairy tales",
    reviews: [],
  },
  3: { author: "Dante Alighieri", title: "The Divine Comedy", reviews: [] },
  4: { author: "Unknown", title: "The Epic Of Gilgamesh", reviews: [] },
  5: { author: "Unknown", title: "The Book Of Job", reviews: [] },
  6: { author: "Unknown", title: "One Thousand and One Nights", reviews: [] },
  7: { author: "Unknown", title: "Nj\u00e1l's Saga", reviews: [] },
  8: { author: "Jane Austen", title: "Pride and Prejudice", reviews: [] },
  9: {
    author: "Honor\u00e9 de Balzac",
    title: "Le P\u00e8re Goriot",
    reviews: [],
  },
  10: {
    author: "Samuel Beckett",
    title: "Molloy, Malone Dies, The Unnamable, the trilogy",
    reviews: [],
  },
};

function getBooks() {
  return new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject(new Error("Books not found"));
    }
  });
}

function getBookById(isbn) {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject(new Error("Book not found"));
    }
  });
}

function getBookByAuthor(author) {
  return new Promise((resolve, reject) => {
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
      resolve(matchedAuthor);
    } else {
      reject(new Error("Author not found"));
    }
  });
}

function getBookByTitle(title) {
  return new Promise((resolve, reject) => {
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
      resolve(matchedTitle);
    } else {
      reject(new Error("Title not found"));
    }
  });
}

module.exports = { getBooks, getBookById, getBookByAuthor, getBookByTitle };
