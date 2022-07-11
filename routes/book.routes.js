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

  console.log(filter)

  Book.find(filter)
    .then( (booksFromDB) => {
        console.log(booksFromDB)
        res.render("books/books-list", { books: booksFromDB })
    })
    .catch( (err) => {
      console.log("Error getting data from DB:", err)
      next(error)
    })
});

router.get('/books/:bookId', (req, res) => {

  const { bookId } = req.params;

  Book.findById(bookId)
    .then(book => {
      console.log(book)
      res.render('books/book-details.hbs', {book})
    })
    .catch(error => {
      console.log('Error while retrieving book details: ', error);
 
      // Call the error-middleware to display the error page to the user
      next(error);
    })
});

module.exports = router;
