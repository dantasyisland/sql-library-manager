const express = require("express");
const router = express.Router();

const { Book } = require("../models");
const { Op } = require("sequelize");

/* Handler function to wrap each route. */
// CB for Callback
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
    // Pagination Logic
    const numberOfbooks = 3;
    const pageQuery = Number.parseInt(req.query.page);
    let page = 0;
    if (!Number.isNaN(pageQuery) && pageQuery > 0) {
      page = pageQuery;
      console.log("hi");
    }

    const books = await Book.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit: numberOfbooks,
      offset: page * numberOfbooks,
    }); // order is array of arrays
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
    const justSearch = Object.fromEntries(thisQuery);
    console.dir(justSearch);

    for (query in justSearch) {
      console.log(`${query} and its value: ${justSearch[query]}`);
    }

    const books = await Book.findAll({
      where: {
        [Op.and]: [justSearch],
      },
    });
    res.render("index", { books, title: "Search" });
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
