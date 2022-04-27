var express = require("express");
var router = express.Router();

/* GET home page. */
// Redirect to Books Route
// Remember every route takes a call back function

router.get("/", (req, res, next) => {
  res.redirect("/book");
});

// Route for testing error
router.get("/error", function (req, res, next) {
  const err = new Error();
  err.status = 404;
  err.message = "Oops! Page not found!";
  next(err);
});

module.exports = router;
