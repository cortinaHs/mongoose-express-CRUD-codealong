const Book = require("../models/Book.model");

const router = require("express").Router();

/* GET home page */
router.get("/books", (req, res, next) => {

  Book.find()
    .then( (booksFromDB) => {
        console.log(booksFromDB)
        res.render("books/books-list", { books: booksFromDB })
    })
    .catch( (err) => console.log("Error getting data from DB:", err))
});

router.get('/books/:bookId', (req, res) => {


  
  res.render('books/book-details.hbs')
});

module.exports = router;
