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
var md5 = require('md5');
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





router.get('/makers', function(req, res) {
  var makersArr = [];
  airtableBase('Makers').select({
    // Selecting the first 3 records in Grid view:
    maxRecords: 3,
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
        makersArr.push(record);
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

}, function done(err) {
    if (err) { 
      console.error(err); return; 
    }
    res.json({success: true, makers:makersArr});
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


router.post('/confirm-order', function(req, res) {
    
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    } 
    if(mm<10){
        mm='0'+mm;
    }     
    var today = yyyy+"-"+mm+"-"+dd;

    airtableBase('Orders').create({
        "Notes (Internal)": "",
        "Status": "Ordered",
        "Client": [
        ],
        "Products": [
           
        ],
            "Order received": today,
            "Items" : JSON.stringify(req.session.cart.items),
            "Email" :req.body.email,
            "FirstName" :req.body.firstName,
            "LastName" :req.body.lastName,
            "Address" : req.body.address,
            "Zip" : req.body.zip,
            "City" : req.body.city,
            "Country" : req.body.country,
            "TotalPrice":parseFloat(req.session.cart.totalPrice)
    }, function(err, record) {
        if (err) { 
          console.error(err); 
          return; 
        }
       res.json(record);
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
      delete decoded._id;
      var filteredData = {
          username:decoded.username
      }
      //res.json(filteredData);
      res.json(decoded);
      
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});



router.get('/get-hash', function(req, res) {
  //var token = getToken(req.headers);
  var date = Math.floor(new Date() / 1000);
  if (true) {
    var codeOriginal = "test1|1.00|"+date+"|Mj725VBHh5UZ4hPKj8Uqd3HAnGKYHCbC";
    var code = md5(codeOriginal);
    res.json({code:code, nonhashe:codeOriginal, time:date});
  } else {
    return res.status(403).send({success: false, msg: 'Could not create hash'});
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


<<<<<<< HEAD
=======
router.get('/my-orders', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.verify(token, config.secret);
    console.log(decoded);
    delete decoded.password;
    var email = decoded.username;
    var formula = "and({Email}='"+email+"')";
    console.log(formula);
      var ordersArr = [];
      airtableBase ('Orders').select({
          view: "Grid view",
          filterByFormula:formula,
      }).eachPage(function page(records, fetchNextPage) {
    
        records.forEach(function(record) {
            ordersArr.push(record);
        });

       fetchNextPage();

    }, function done(err) {
        if (err) { 
          console.error(err);
          return; 
        }
        res.json({success: true, orders:ordersArr});
    });

  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

>>>>>>> origin/wishlist
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