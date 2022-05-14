const { Book } = require("../models/book");
const { Op } = require("sequelize");

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

function get() {
  asyncHandler(async (req, res) => {
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
}

module.exports = {
  get,
};
