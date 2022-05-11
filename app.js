const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

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

// Routes
const indexRouter = require("./routes/index");
const booksRouter = require("./routes/books");
const { render } = require("express/lib/response");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.json());

// For Query Params
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

// static
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/", indexRouter);
app.use("/books", booksRouter);

// catch 404 errors and forward to error handler
app.use(function (req, res, next) {
  next(
    createError(404, "Sorry! We couldn't find the page you were looking for")
  );
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.status);
  console.error(err.message);
  if (err.status == 500) {
    err.message = "So Sorry! Something went wrong on the server";

    res.render("error", { err });
  } else if (err.status == 404) {
    res.render("page-not-found", { err });
  } else res.status(err.status).render("error", { err });
});

module.exports = app;
