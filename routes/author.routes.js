const Book = require("../models/Book.model");
const Author = require('../models/Author.model');

const router = require("express").Router();


router.get("/authors", (req, res, next) => {

    let books; // we create a variable in the parent scope

    Book.find()
      .then((booksFromDB) => {
        books = booksFromDB;
        return Author.find();
      })
      .then(authorsFromDB => {
  
        const authorsArr = authorsFromDB.map((authorDetails) => {
            const { _id, name, age, country } = authorDetails;
            const booksFromCurrentAuthor = books.filter(book => {
              return book.author.toString() == _id.toString(); // compare ids as string
            })
            const numberOfBooks = booksFromCurrentAuthor.length;
    
            return { name, age, country, numberOfBooks };
          })

       
        res.render("authors/authors-list", { authors: authorsArr });
      })
      .catch((error) => {
        console.log("Error getting authors from DB", error);
        next(error);
      })
  });

module.exports = router;