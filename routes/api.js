var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
var validator = require("email-validator");
 
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
var Book = require("../models/book");
var Cart = require("../models/cart");
var Airtable = require('airtable');


var airtableBase = new Airtable({apiKey: 'key2rlTpmEcDJG0jE'}).base('appt5j605NfW5vDOF');


router.get('/products', function(req, res) {
  var productsArr = [];
  airtableBase ('Products').select({
    // Selecting the first 3 records in Grid view:
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
      productsArr.push(record);
    });

    fetchNextPage();

}, function done(err) {
    if (err) { 
      console.error(err); return; 
    }
    res.json({success: true, products:productsArr});
});
   
});

router.get('/product-details/:id', function(req, res) {
  var product = {};
  var productId = req.params.id;
  airtableBase ('Products').find(productId, function(err, record){
    if(err) {
      console.error(err);
      return;
    } else {
      res.json(record);
    }
  });
});

router.get('/blog-posts', function(req, res) {
  var blogPostsArr = [];
  airtableBase ('Blog Posts').select({
    // Selecting the first 3 records in Grid view:
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
      blogPostsArr.push(record);
    });

    fetchNextPage();

}, function done(err) {
    if (err) { 
      console.error(err); return; 
    }
    res.json({success: true, blogPosts:blogPostsArr});
});
   
});


router.get('/blog-post-details/:id', function(req, res) {
  var blogPost = {};
  var blogPostId = req.params.id;
  airtableBase ('Blog Posts').find(blogPostId, function(err, record){
    if(err) {
      console.error(err);
      return;
    } else {
      res.json(record);
    }
  });
});

router.post('/signup', function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass valid username and password.'});
  } else {
    // check if email is valid email
    var testEmail = validator.validate(req.body.username);
    if(testEmail) {
        var newUser = new User({
          username: req.body.username,
          password: req.body.password,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          telephone: req.body.telephone,
          address: req.body.address,
          zip: req.body.zip,
          city: req.body.city,
          country: req.body.country,

        });
        if(req.body.password == req.body.passwordConfirm) {
            // save the user
            newUser.save(function(err) {
                if (err) {
                    return res.json({success: false, msg: 'Username already exists.'});
                }
                res.json({success: true, msg: 'Successful created new user.'});
            });
        } else {
            return res.json({success: false, msg: "Passwords don't match"});
        }
      } else {
          return res.json({success: false, msg: 'Email must be valid email address'});
      }
  }
});


router.post('/signin', function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});



router.post('/book', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    console.log(req.body);
    var newBook = new Book({
      isbn: req.body.isbn,
      title: req.body.title,
      author: req.body.author,
      publisher: req.body.publisher
    });

    newBook.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Save book failed.'});
      }
      res.json({success: true, msg: 'Successful created new book.'});
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.get('/user', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
      var decoded = jwt.verify(token, config.secret);
      delete decoded.password;
      var filteredData = {
          username:decoded.username
      }
      res.json(filteredData);
      
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.get('/book', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Book.find(function (err, books) {
      if (err) return next(err);
      res.json(books);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.get('/cart', function(req, res, next) {
  var currentCart = new Cart(req.session.cart ? req.session.cart:{});
  req.session.cart = currentCart;
  res.send(JSON.stringify(req.session.cart));
});


router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  airtableBase ('Products').find(productId, function(err, record){
    if(err) {
      console.error(err);
      return;
    } else {
        var newCart = new Cart(req.session.cart ? req.session.cart:{});
        var formattedPrice = parseFloat(record.fields.Price).toFixed(2);
        var imageUrl = "";
        if(typeof record.fields.Pictures[0] !== 'undefined') {
          imageUrl = record.fields.Pictures[0].url;
        }
        var newItem = {
            id:record.id,
            name:record.fields.Name,
            price:formattedPrice,
            quantity:1,
            imageUrl:imageUrl
        };
        newCart.add(newItem);
        req.session.cart = newCart;
        //res.send(JSON.stringify(req.session));
        res.json(newCart);
      }
    });
});


router.get('/empty-cart', function(req, res, next) {
  var emptyCart = new Cart({});
  req.session.cart = emptyCart;
  res.send(JSON.stringify(req.session));
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};


module.exports = router;