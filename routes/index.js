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

module.exports = router;
