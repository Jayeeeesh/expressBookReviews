const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");


public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password ||
    [username, password].some(field => field.trim() === "")) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });

  return res.status(201).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.status(200).send(JSON.stringify(books, null, 4));
})
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn
  const book = books[isbn]

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLocaleLowerCase()
  const bookKeys = Object.keys(books);
  let matchedBooks = [];

  bookKeys.forEach((key) => {
    if (books[key].author.toLowerCase() === author) {
      matchedBooks.push(books[key]);
    }
  });

  if (matchedBooks.length > 0) {
    return res.status(200).json(matchedBooks);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLocaleLowerCase()
  const bookKeys = Object.keys(books);
  let matchedBooks = []

  bookKeys.forEach((key) => {
    if (books[key].title.toLowerCase().includes(title)) {
      matchedBooks.push(books[key]);
    }
  });

  if (matchedBooks.length > 0) {
    return res.status(200).json(matchedBooks);
  } else {
    return res.status(404).json({ message: "No books found by this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

async function getAllBooks() {
  try {
     const response = await axios.get('http://localhost:3000/');
    return response.data;
  } catch (error) {
     return error.message;
  }
}
 
async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(`http://localhost:3000/isbn/${isbn}`);
    return response.data;  
  } catch (error) {
    return error.response ? error.response.data : error.message;
  }
}

async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:3000/author/${author}`);
    return response.data; 
  } catch (error) {
    return error.response ? error.response.data : error.message;
  }
}

async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`http://localhost:3000/title/${title}`);
    return response.data; 
  } catch (error) {
    return error.response ? error.response.data : error.message;
  }
}


module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;