const router = require("express").Router();

const User = require('../models/User.model');

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

router.get('/signup', (req, res) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
    const { username, email, password } = req.body;

    //backend validation
    if (!username || !email || !password) {
        res.render("auth/register", { errorMessage: "Please provide username, email and password" });
        return;
    }

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {

            const userDetails = {
                username,
                email,
                passwordHash: hashedPassword
              }
        
              return User.create(userDetails)
        })
        .then(userFromDB => {
            res.redirect('/userProfile');
          })
          .catch(error => {
            console.log("error creating account", error);
            next(error);
          });
    });


router.get('/userProfile', (req, res) => res.render('users/user-profile'));


module.exports = router;