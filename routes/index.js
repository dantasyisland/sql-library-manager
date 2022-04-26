var express = require("express");
var router = express.Router();

const { Book } = require("../models");

/* GET home page. */
router.get("/", function (req, res, next) {
  (async () => {
    try {
      const books = await Book.findAll();
      console.log(books.every((book) => book instanceof Book));
      res.json(books);
    } catch {}
  })();
});

// Route for testing error
router.get("/error", function (req, res, next) {
  const err = new Error();
  err.status = 404;
  err.message = "Oops! Page not found!";
  next(err);
});

module.exports = router;
