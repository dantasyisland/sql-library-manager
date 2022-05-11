const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
// const logger = require("morgan");

// Database File
const db = require("./models/index");
(async () => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync();
    console.log("successs");
  } catch (error) {
    console.error(error);
  }
})();

// Routers
var indexRouter = require("./routes/index");
var booksRouter = require("./routes/books");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// app.use(logger("dev"));
app.use(express.json());

// For Query Params
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// static
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/", indexRouter);
app.use("/books", booksRouter);

// catch 404 and forward to error handler
// uses createError()
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler

// Render the page-not-found template - pug template
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", { err });
});

module.exports = app;
