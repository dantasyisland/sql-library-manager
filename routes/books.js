const express = require("express");
const router = express.Router();

const { Book } = require("../models");
const { Op } = require("sequelize");

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
    res.render("index", {
      books,
      title: "BOOKS",
    });
  })
);

// Takes query params
// NEED A SEARCH RESULT PAGE (render back to books)
router.get(
  "/search",
  asyncHandler(async (req, res) => {
    console.log(req.query.genre);
    // that query is wrong - select fantasy from Books AS Book
    const books = await Book.findAll({
      // attributes: [`${req.query.genre}`],
      where: {
        [Op.or]: [
          { genre: `${req.query.genre}` },
          { title: `${req.query.title}` },
          { author: `${req.query.author}` },
          { year: `${req.query.year}` },
        ],
      },
      limit: 2,
    });
    res.render("index", { books, title: "Search" });
  })
);

// New Books

router.get("/new", (req, res) => {
  res.render("new-book", {
    book: {},
    title: "New Book",
  });
});

// Create New Book

router.post(
  "/new",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect(`/books/${book.id}`);
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        console.log(error.name);

        book = await Book.build(req.body);
        // Pass error json
        res.render("new-book", {
          book,
          errors: error.errors,
          title: "New Book",
        });
      } else {
        throw error;
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
      res.render("update-book", {
        book,
        title: `Update Book: ${book.title}`,
      });
    } else {
      res.sendStatus(404);
    }
  })
);

// UPDATE Book
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
    } catch (error) {
      // Render error - pug template
      // try catch error block
      //pug loop
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id;
        // Pass error json
        res.render("update-book", {
          book,
          errors: error.errors,
          title: "Update Book",
        });
      }
    }
  })
);

// Delete Book

router.post(
  "/delete/:id",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      await book.destroy();
      res.redirect("/books");
    } catch {}
  })
);

module.exports = router;
