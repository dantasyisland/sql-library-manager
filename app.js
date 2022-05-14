const express = require("express");
const createError = require("http-errors");
const path = require("path");

// Routes
const indexRouter = require("./routes/index");
const booksRouter = require("./routes/books");

const app = express();

// Pug setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.json());

// For Query Params
app.use(express.urlencoded({ extended: false }));

// For serving static files
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/", indexRouter);
app.use("/books", booksRouter);

// Catch 404 errors and forward to error handler
app.use(function (req, res, next) {
  next(
    createError(404, "Sorry! We couldn't find the page you were looking for")
  );
});

// Error handler
app.use(function (err, req, res, next) {
  if (err.status == 500) {
    err.message = "So Sorry! Something went wrong on the server";
    res.render("error", { err });
  } else if (err.status == 404) {
    res.render("page-not-found", { err });
  } else res.status(err.status).render("error", { err });
  console.error(err.status);
  console.error(err.message);
});

module.exports = app;
