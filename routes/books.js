const express = require("express");
const router = express.Router();
const createError = require("http-errors");
// const querystring = require("querystring");

const { Book } = require("../models");
const { Op } = require("sequelize");

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

// Books Route
router.get(
  "/",
  asyncHandler(async (req, res) => {
    // Pagination Logic
    const numberOfbooks = 5;
    const pageQuery = Number.parseInt(req.query.page);
    let page = 0;
    if (!Number.isNaN(pageQuery) && pageQuery > 0) {
      page = pageQuery;
    }

    const books = await Book.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit: numberOfbooks,
      offset: page * numberOfbooks,
    });

    res.render("index", {
      books: books.rows,
      title: "BOOKS",
      pages: Math.ceil(books.count / numberOfbooks),
    });
  })
);

router.get(
  "/search",
  asyncHandler(async (req, res) => {
    let queryArray = Object.entries(req.query);
    let thisQuery = queryArray.filter(([key, value]) => value !== "");
    const justSearchTerms = Object.fromEntries(thisQuery);

    const books = await Book.findAll({
      where: {
        [Op.and]: [justSearchTerms],
      },
    });
    res.render("index", { books, title: "Search" });
  })
);

router.get(
  "/test",
  asyncHandler(async (req, res) => {
    console.log(req.query);
    console.log(Object.keys(req.query));

    const books = await Book.findAll({
      attributes: Object.keys(req.query),
    });
    res.send("Hi");
  })
);

// New Book Route
router.get("/new", (req, res) => {
  res.render("new-book", {
    book: {},
    title: "New Book",
  });
});

// CREATE New Book
router.post(
  "/new",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect(`/books/${book.id}`);
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("new-book", {
          book,
          errors: error.errors,
          title: "New Book",
        });
      }
    }
  })
);

// GET individiual book
router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);

    if (book) {
      res.render("update-book", {
        book,
        title: `Update Book: ${book.title}`,
      });
    } else {
      next(createError(404, "This book does not exist"));
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
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render("update-book", {
          book,
          errors: error.errors,
          title: "Update Book",
        });
      }
    }
  })
);

// DELETE Book
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
