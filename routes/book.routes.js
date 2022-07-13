const Book = require("../models/Book.model");
const Author = require('../models/Author.model');

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

const router = require("express").Router();

router.get("/books", (req, res, next) => {

  let filter = {};

  if(req.query.title) {
    filter.title = {"$regex": req.query.title, "$options": "i"}
  }

  if(req.query.rating){
    filter.rating = {$gte: req.query.rating}
  }

  Book.find(filter)
    .populate("author")
    .then( (booksFromDB) => {
        res.render("books/books-list", { books: booksFromDB })
    })
    .catch( (error) => {
      console.log("Error getting data from DB:", error)
      next(error)
    })
});


router.get('/books/create', isLoggedIn, (req, res) => {

  Author.find()
    .then((authorsFromDB) => {
      res.render('books/book-create.hbs', {authors: authorsFromDB})
    })
    .catch( (error) => console.log("Error getting data from DB:", error))
});

router.post('/books/create', (req, res, next) => {
  const { title, author, description, rating } = req.body;

  Book.create({ title, author, description, rating })
    .then(() => res.redirect('/books'))
    .catch(error => next("Error creating new Document:", error));
});


router.get('/books/:bookId', (req, res) => {

  const { bookId } = req.params;

  Book.findById(bookId)
    .populate("author")
    .then(book => res.render("books/book-details.hbs", {book}))
    .catch(error => {
      console.log("Error while retrieving book details: ", error);
 
      // Call the error-middleware to display the error page to the user
      next(error);
    })
});

router.get('/books/:bookId/edit', isLoggedIn, (req, res, next) => {
  const { bookId } = req.params;
 
  Book.findById(bookId)
    .populate("author")
    .then(bookToEdit => {
      res.render('books/book-edit.hbs', { book: bookToEdit });
    })
    .catch(error => next(error));
});

router.post('/books/:bookId/edit', (req, res, next) => {
  const { bookId } = req.params;
  const { title, description, author, rating } = req.body;
 
  Book.findByIdAndUpdate(bookId, { title, description, author, rating }, { new: true })
    .then(updatedBook => res.redirect(`/books/${updatedBook.id}`)) // go to the details page to see the updates
    .catch(error => next(error));
});

router.post('/books/:bookId/delete', isLoggedIn, (req, res, next) => {
  const { bookId } = req.params;
 
  Book.findByIdAndDelete(bookId)
    .then(() => res.redirect('/books'))
    .catch(error => next(error));
});
 

module.exports = router;
