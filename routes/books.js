const express = require("express");
const router = express.Router();

const { Book } = require("../models");

//cb is callback - when working with sequelize
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  };
}

// Books Route
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll({ order: [["createdAt", "DESC"]] }); // order is array of arrays
    res.render("index", { books, title: "BOOKS" });
  })
);

// New Books

router.get("/new", (req, res) => {
  res.render("new-book", { book: {}, title: "New Book" });
});

// Create New Book

router.post(
  "/new",
  asyncHandler(async (req, res) => {
    let book;
    console.log(req.body);
    try {
      book = await Book.create(req.body);
      console.log("posted");
      res.redirect(`/books/${book.id}`);
    } catch (error) {
      // Render error - pug template
      // try catch error block
      //pug loop
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        console.dir(error);
        // Pass error json
        res.render("error", { errors: error.errors, title: "New Book Error" });
      }
    }
  })
);

// GET individiual book
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);

    // if Book exists
    if (book) {
      res.render("update-book", { book, title: `Update Book: ${book.title}` });
    } else {
      res.sendStatus(404);
    }
  })
);

router.post(
  "/:id",
  asyncHandler(async (req, res) => {
    let book;

    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/books");
      }
    } catch {}
    // Get params from req
  })
);

router.post(
  "/delete/:id",
  asyncHandler(async (req, res) => {
    console.log("did");
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      await book.destroy();
      res.redirect("/books");
    } catch {}
  })
);

module.exports = router;
