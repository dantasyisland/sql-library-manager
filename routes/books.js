const express = require("express");
const router = express.Router();
const createError = require("http-errors");

const { Book } = require("../models");
const { Op } = require("sequelize");
const booksController = require("../controllers/booksController");

// GET All Books Route
router.get("/", booksController.getAllBooks);

// GET individiual book
router.get("/:id", booksController.getIndividualBook);

// Search Books Route
router.get("/search", booksController.searchBooks);

// New Book Route
router.get("/new", (req, res) => {
  res.render("new-book", {
    book: {},
    title: "New Book",
  });
});

// CREATE New Book Route
router.post("/new", booksController.createBook);

// UPDATE Book
router.post("/:id", booksController.updateBook);

// DELETE Book
router.post("/delete/:id", booksController.deleteBook);

module.exports = router;
