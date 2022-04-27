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

router.get("/new", (req, res) => {
  res.render("new-book", { book: {}, title: "New Book" });
});

module.exports = router;
