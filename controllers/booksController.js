const { Book } = require("../models/");
const { Op } = require("sequelize");
const createError = require("http-errors");
const res = require("express/lib/response");

/* Handler function for wrapping try catch block */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

const getAllBooks = asyncHandler(async (req, res) => {
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
});

const getIndividualBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);

  if (book) {
    res.render("update-book", {
      book,
      title: `Update Book: ${book.title}`,
    });
  } else {
    next(createError(404, "This book does not exist"));
  }
});

const searchBooks = asyncHandler(async (req, res) => {
  console.log(req.query);
  const queryArray = Object.entries(req.query);
  console.log(queryArray);
  const searchTermsArray = queryArray.filter(([key, value]) => value != "");
  console.log(searchTermsArray);
  const searchParamObj = Object.fromEntries(searchTermsArray);
  console.log(searchParamObj);

  for (term in searchParamObj) {
    searchParamObj[term] = { [Op.like]: `%${searchParamObj[term]}%` };
  }
  console.dir(searchParamObj);

  const searchThis = {
    where: {
      [Op.or]: searchParamObj,
    },
  };

  const books = await Book.findAll(searchThis);
  res.render("index", { books, title: "Search" });
});

const createBook = asyncHandler(async (req, res) => {
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
});

const updateBook = asyncHandler(async (req, res) => {
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
});

const deleteBook = asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect("/books");
  } catch {}
});

module.exports = {
  getAllBooks,
  searchBooks,
  createBook,
  getIndividualBook,
  updateBook,
  deleteBook,
};
