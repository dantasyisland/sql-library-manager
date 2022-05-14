var express = require("express");
var router = express.Router();

/* GET home page. */
// Redirect to Books Route

router.get("/", (req, res, next) => {
  res.redirect("/books");
});

// Route for testing 500 error
router.get("/error", function (req, res, next) {
  const err = new Error();
  err.status = 500;
  next(err);
});

module.exports = router;
