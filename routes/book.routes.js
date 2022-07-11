const Book = require("../models/Book.model");

const router = require("express").Router();

/* GET home page */
router.get("/books", (req, res, next) => {

  let filter = {};

  if(req.query.title) {
    filter.title = {"$regex": req.query.title, "$options": "i"}
  }

  if(req.query.rating){
    filter.rating = {$gte: req.query.rating}
  }

  Book.find(filter)
    .then( (booksFromDB) => {
        res.render("books/books-list", { books: booksFromDB })
    })
    .catch( (error) => {
      console.log("Error getting data from DB:", error)
      next(error)
    })
});


router.get('/books/create', (req, res) => res.render('books/book-create.hbs'));

router.post('/books/create', (req, res, next) => {
  const { title, author, description, rating } = req.body;

  Book.create({ title, author, description, rating })
    .then(() => res.redirect('/books'))
    .catch(error => next("Error creating new Document:", error));
});


router.get('/books/:bookId', (req, res) => {

  const { bookId } = req.params;

  Book.findById(bookId)
    .then(book => res.render("books/book-details.hbs", {book}))
    .catch(error => {
      console.log("Error while retrieving book details: ", error);
 
      // Call the error-middleware to display the error page to the user
      next(error);
    })
});

router.get('/books/:bookId/edit', (req, res, next) => {
  const { bookId } = req.params;
 
  Book.findById(bookId)
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

router.post('/books/:bookId/delete', (req, res, next) => {
  const { bookId } = req.params;
 
  Book.findByIdAndDelete(bookId)
    .then(() => res.redirect('/books'))
    .catch(error => next(error));
});
 

module.exports = router;
