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

var myConfig = require('../my-config');


var airtableBase = new Airtable({apiKey: 'key2rlTpmEcDJG0jE'}).base('appt5j605NfW5vDOF');


router.get('/products', function(req, res) {
  var productsArr = [];
  var params = req.query;
  var categoryName = "";
  if(params.category) {
    var categoryName = params.category.toLowerCase();
  }

  if(categoryName.length > 0) {
    var airtableParams = {
      view:"Grid view",
      filterByFormula: "and(LOWER(Category)='"+categoryName+"')"
    }
  } else {
    var airtableParams = {
      view:"Grid view",
    }
  }

  airtableBase ('Products').select(airtableParams).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
        if(typeof record.fields.Price !== 'undefined') {
            productsArr.push(record);
        }
    });

    productsArr.forEach(function(record) {
        var taxValue = parseFloat(myConfig.tax) * parseFloat(record.fields.Price);
        record.fields.taxValue = taxValue;
        record.fields.finalPrice = (parseFloat(record.fields.Price) + parseFloat(taxValue)).toFixed(2);
    });

    fetchNextPage();

}, function done(err) {
    if (err) {
      console.error(err); return;
    }
    res.json({success: true, products:productsArr});
});

});


router.get('/items-pagination', function(req, res) {
  
  var maxRecords = myConfig.itemsPerPage;
  var productsArr = [];
  var paginatedProductsArr = [];
  var params = req.query;
  var askedPage = 1;
  if(params.page) {
      askedPage = params.page;
  }

  if(!req.session.cachedItems || req.session.cachedItems.length == 0) {


  var categoryName = "";
  var pageOffsetsArr = [];
  if(params.category) {
    var categoryName = params.category.toLowerCase();
  }

  var fields = ["Fotos", "Name", "Price", "Maker"];

  if(categoryName.length > 0) {
    var airtableParams = {
      view:"Grid view",
      filterByFormula: "and(LOWER(Category)='"+categoryName+"')",
      //maxRecords:maxRecords,
      pageSize:maxRecords,
      fields:fields
    }
  } else {
    var airtableParams = {
      view:"Grid view",
      //maxRecords:maxRecords,
      pageSize:maxRecords,
      fields:fields
    }
  }

  var pageNumber = 1;


  airtableBase ('Items').select(airtableParams).eachPage(function page(records, fetchNextPage) {

    // This function (`page`) will get called for each page of records.

    pageNumber++;

    records.forEach(function(record) {
        if(typeof record.fields.Price !== 'undefined') {
            productsArr.push(record);
            paginatedProductsArr[pageNumber] = record;
            console.log(record);
        }
    });

    productsArr.forEach(function(record) {
        var taxValue = parseFloat(myConfig.tax) * parseFloat(record.fields.Price);
        record.fields.taxValue = taxValue;
        record.fields.finalPrice = (parseFloat(record.fields.Price) + parseFloat(taxValue)).toFixed(2);
    });

    fetchNextPage();

}, function done(err) {
    if (err) {
      console.error(err); return;
    }
    res.json({success: true, products:productsArr, method:'fetched'});
});

} else {
      console.log(req.session.cachedItems);
    res.json({success: true, products:req.session.cachedItems[askedPage], method:'cached'});
}

});



router.get('/items-total-number', function(req, res) {
  var productsArr = [];
  var paginatedProducts = [];
  var params = req.query;
  var categoryName = "";
  var maxRecords = 20;
  var pageNumber = 0;
  req.session.cachedItems = [];
  var fields = ["Fotos", "Name", "Price", "Maker"];
  var totalRecords = 0;
  if(params.category) {
    var categoryName = params.category.toLowerCase();
  }

  if(categoryName.length > 0) {
    var airtableParams = {
      view:"Grid view",
      filterByFormula: "and(LOWER(Category)='"+categoryName+"')",
      fields:fields,
      pageSize:maxRecords
    }
  } else {
    var airtableParams = {
      view:"Grid view",
      fields:fields,
      pageSize:maxRecords
    }
  }


  airtableBase ('Items').select(airtableParams).eachPage(function page(records, fetchNextPage) {

    // This function (`page`) will get called for each page of records.

    pageNumber++;
    if(!paginatedProducts[pageNumber]) {
        paginatedProducts[pageNumber] = [];
    }

    records.forEach(function(record) {
        if(typeof record.fields.Price !== 'undefined') {
            productsArr.push(record);
            paginatedProducts[pageNumber].push(record);
        }
        totalRecords++;
    });

    productsArr.forEach(function(record) {
        var taxValue = parseFloat(myConfig.tax) * parseFloat(record.fields.Price);
        record.fields.taxValue = taxValue;
        record.fields.finalPrice = (parseFloat(record.fields.Price) + parseFloat(taxValue)).toFixed(2);
    });

    fetchNextPage();

}, function done(err) {
    if (err) {
      console.error(err); return;
    }
    req.session.cachedItems = paginatedProducts;
    res.json({success: true, total:totalRecords, paginatedProducts:paginatedProducts, pageNumber:pageNumber});
});

});


router.get('/items', function(req, res) {
  var productsArr = [];
  var params = req.query;
  var categoryName = "";
  var maxRecords = myConfig.itemsPerPage;
  var fields = ["Fotos", "Name", "Price", "Maker"];
  if(params.category) {
    var categoryName = params.category.toLowerCase();
  }

  if(categoryName.length > 0) {
    var airtableParams = {
      view:"Grid view",
      filterByFormula: "and(LOWER(Category)='"+categoryName+"')",
      pageSize:maxRecords,
      fields:fields
    }
  } else {
    var airtableParams = {
      view:"Grid view",
      pageSize:maxRecords,
      fields:fields
    }
  }


  airtableBase ('Items').select(airtableParams).eachPage(function page(records, fetchNextPage) {

    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
        if(typeof record.fields.Price !== 'undefined') {
            productsArr.push(record);
        }
    });

    productsArr.forEach(function(record) {
        var taxValue = parseFloat(myConfig.tax) * parseFloat(record.fields.Price);
        record.fields.taxValue = taxValue;
        record.fields.finalPrice = (parseFloat(record.fields.Price) + parseFloat(taxValue)).toFixed(2);
    });

    fetchNextPage();

}, function done(err) {
    if (err) {
      console.error(err); return;
    }
    res.json({success: true, products:productsArr});
});

});


router.get('/featured-items', function(req, res) {
  var productsArr = [];
  var params = req.query;
  var categoryName = "";
  if(params.category) {
    var categoryName = params.category.toLowerCase();
  }

  if(categoryName.length > 0) {
    var airtableParams = {
      view:"Grid view",
      filterByFormula: "and(LOWER(Category)='"+categoryName+"',{Featured Keep}=1)"
    }
  } else {
    var airtableParams = {
      view:"Grid view",
      filterByFormula: "and({Featured Keep}=1)"
    }
  }

  airtableBase ('Items').select(airtableParams).eachPage(function page(records, fetchNextPage) {

    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
        if(typeof record.fields.Price !== 'undefined') {
            productsArr.push(record);
        }
    });

    productsArr.forEach(function(record) {
        var taxValue = parseFloat(myConfig.tax) * parseFloat(record.fields.Price);
        record.fields.taxValue = taxValue;
        record.fields.finalPrice = (parseFloat(record.fields.Price) + parseFloat(taxValue)).toFixed(2);
    });

    fetchNextPage();

}, function done(err) {
    if (err) {
      console.error(err); return;
    }
    res.json({success: true, featuredProducts:productsArr});
});

});


router.get('/kits', function(req, res) {
  var kitsArr = [];
  var params = req.query;
  var categoryName = "";
  if(params.category) {
    var categoryName = params.category.toLowerCase();
  }

  if(categoryName.length > 0) {
    var airtableParams = {
      view:"Grid view",
      filterByFormula: "and(LOWER(Category)='"+categoryName+"',{Kits}=1)"
    }
  } else {
    var airtableParams = {
      view:"Grid view",
      filterByFormula: "and({Kits}=1)"
    }
  }

  airtableBase ('Items').select(airtableParams).eachPage(function page(records, fetchNextPage) {

    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
        if(typeof record.fields.Price !== 'undefined') {
            kitsArr.push(record);
        }
    });

    kitsArr.forEach(function(record) {
        var taxValue = parseFloat(myConfig.tax) * parseFloat(record.fields.Price);
        record.fields.taxValue = taxValue;
        record.fields.finalPrice = (parseFloat(record.fields.Price) + parseFloat(taxValue)).toFixed(2);
    });

    fetchNextPage();

}, function done(err) {
    if (err) {
      console.error(err); return;
    }
    res.json({success: true, kits:kitsArr});
});

});

router.get('/records-by-id/', function(req, res) {
  var objectsArr = [];
  var params = req.query;

  var tableName = params.table;
  var recordsIds = params.recordsIds;

  var seperateCommas = recordsIds.split(",");
  var buildFormula = "OR(";

  for(var i = 0; i<seperateCommas.length; i++) {
      if(i == (seperateCommas.length-1)) {
          buildFormula = buildFormula + "RECORD_ID() = '"+seperateCommas[i]+"'";
      } else {
          buildFormula = buildFormula + "RECORD_ID() = '"+seperateCommas[i]+"', ";
      }

  }

  buildFormula = buildFormula + ")";


    var airtableParams = {
      view:"Grid view",
      filterByFormula: buildFormula
    }

  airtableBase (tableName).select(airtableParams).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
      objectsArr.push(record);
    });

    fetchNextPage();

}, function done(err) {
    if (err) {
      console.error(err); return;
    }
    res.json({success: true, objects:objectsArr});
});


});




router.get('/makers', function(req, res) {
  var makersArr = [];
  airtableBase('Makers').select({
    // Selecting the first 3 records in Grid view:
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
  airtableBase ('Products').find(productId, function(err, record) {
    var taxValue = parseFloat(record.fields.Price*myConfig.tax);
    record.fields.taxValue = taxValue;
    record.fields.finalPrice = (parseFloat(record.fields.Price) + parseFloat(taxValue)).toFixed(2);
    if(err) {
      console.error(err);
      return;
    } else {
      res.json(record);
    }
  });
});



router.get('/item-details/:id', function(req, res) {
  var product = {};
  var productId = req.params.id;
  airtableBase ('Items').find(productId, function(err, record) {
    var taxValue = parseFloat(record.fields.Price*myConfig.tax);
    record.fields.taxValue = taxValue;
    record.fields.finalPrice = (parseFloat(record.fields.Price) + parseFloat(taxValue)).toFixed(2);
    if(err) {
      console.error(err);
      return;
    } else {
      res.json(record);
    }
  });
});


router.get('/maker-details/:id', function(req, res) {
  var product = {};
  var makerId = req.params.id;
  airtableBase ('Makers').find(makerId, function(err, record){
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
    var json = req.session.cart.items;

    var nicelyParsedProducts = "";
    for(var i = 0; i<json.length; i++){
        var priceWithTax = json[i].price+(myConfig.tax*json[i].price);
        if(i == (json.length-1)) {
            nicelyParsedProducts = nicelyParsedProducts+json[i].quantity+"x "+json[i].name+" (id:"+json[i].id+") - $"+ json[i].price+ " each(including $"+json[i].taxValue.toFixed(2)+" tax)"+" \n";
        } else {
            nicelyParsedProducts = nicelyParsedProducts+json[i].quantity+"x "+json[i].name+" (id:"+json[i].id+") - $"+ json[i].price+ " each(including $"+json[i].taxValue.toFixed(2)+" tax),"+" \n";
        }

    }


    var totalPriceWithTax = parseFloat(req.session.cart.totalPrice);


    airtableBase('Orders').create({
        "Notes (Internal)": "",
        "Status": "Ordered",
        "Client": [
        ],
            "Order received": today,
            "Items" : nicelyParsedProducts,
            "Email" :req.body.email,
            "FirstName" :req.body.firstName,
            "LastName" :req.body.lastName,
            "Address" : req.body.address,
            "Zip" : req.body.zip,
            "City" : req.body.city,
            "Country" : req.body.country,
            "TotalPrice":totalPriceWithTax
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
    res.json({success: false, msg: 'Please use a valid username and password.'});
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
                res.json({success: true, msg: 'Successfully created your account.'});
            });
            // save to Airtable
            airtableBase('Clients').create({
                "Name": newUser.firstName+" "+newUser.lastName,
                "Notes (Internal)": "",
                "Email": newUser.username,
                "Phone": newUser.telephone,
                "Country": newUser.country,
                "Wishlist": [
                ],
                "Reviews": [
                ],
                "Orders": [
                ]
            }, function(err, record) {
              if (err) {
                  console.error(err);
                  return;
              }
          })
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


router.get('/my-orders', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  var params = req.query;
  var orderStatus = "";
  if(params.status) {
      orderStatus = params.status.toLowerCase();
  }
  if (token) {
    var decoded = jwt.verify(token, config.secret);
    delete decoded.password;
    var email = decoded.username;
    if (orderStatus.length > 0) {
        var formula = "and({Email}='"+email+"',LOWER(Status)='"+orderStatus+"' )";
    } else {
        var formula = "and({Email}='"+email+"')";
    }

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
        var taxValue = myConfig.tax * formattedPrice;
        var finalPrice = parseFloat(formattedPrice)+parseFloat(taxValue);
        var newItem = {
            id:record.id,
            name:record.fields.Name,
            price:finalPrice.toFixed(2),
            quantity:1,
            imageUrl:imageUrl,
            priceWithoutTax:formattedPrice,
            taxValue:taxValue
        };
        newCart.add(newItem);
        req.session.cart = newCart;
        //res.send(JSON.stringify(req.session));
        res.json(newCart);
      }
    });

});



router.get('/remove-item-from-cart/:id', function(req, res, next) {
        var toBeRemovedItemId = req.params.id;
        var newCart = new Cart(req.session.cart ? req.session.cart:{});
        newCart.remove(toBeRemovedItemId);
        req.session.cart = newCart;
        res.json(newCart);
});



router.get('/add-item-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  airtableBase ('Items').find(productId, function(err, record){
    if(err) {
      console.error(err);
      return;
    } else {
        var newCart = new Cart(req.session.cart ? req.session.cart:{});
        var formattedPrice = parseFloat(record.fields.Price).toFixed(2);
        var imageUrl = "";
        if(typeof record.fields.Fotos[0] !== 'undefined') {
          imageUrl = record.fields.Fotos[0].url;
        }
        var taxValue = myConfig.tax * formattedPrice;
        var finalPrice = parseFloat(formattedPrice)+parseFloat(taxValue);
        var newItem = {
            id:record.id,
            name:record.fields.Name,
            price:finalPrice.toFixed(2),
            quantity:1,
            imageUrl:imageUrl,
            priceWithoutTax:formattedPrice,
            taxValue:taxValue
        };
        newCart.add(newItem);
        req.session.cart = newCart;
        //res.send(JSON.stringify(req.session));
        res.json(newCart);
      }
    });

});

router.get('/add-to-wishlist/:id', passport.authenticate('jwt', { session: false}),function(req, res, next) {
    var token = getToken(req.headers);
    if(token) {
        var decoded = jwt.verify(token, config.secret);
        delete decoded.password;
        var email = decoded.username;
        var productId = req.params.id;
        var formula = "and({Email}='"+email+"')";
        var clientArr = [];
        airtableBase ('Clients').select({
            view: "Grid view",
            filterByFormula:formula,
            }).eachPage(function page(records, fetchNextPage) {
                records.forEach(function(record) {
                    clientArr.push(record);
                });
              fetchNextPage();
              }, function done(err) {
                if (err) {
                  console.error(err);
                  return;
                }
                console.log(clientArr[0]);
                if(clientArr[0]) {
                    airtableBase('Wishlist').create({
                        "Client": [clientArr[0].id],
                        "Product": [productId]
                    }, function(err, record) {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    })
                  };
                  return res.status(200).send({success: true});
             });
      } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
      }
});


router.get('/add-item-to-wishlist/:id', passport.authenticate('jwt', { session: false}),function(req, res, next) {
    var token = getToken(req.headers);
    if(token) {
        var decoded = jwt.verify(token, config.secret);
        delete decoded.password;
        var email = decoded.username;
        var productId = req.params.id;
        var formula = "and({Email}='"+email+"')";
        var clientArr = [];
        airtableBase ('Clients').select({
            view: "Grid view",
            filterByFormula:formula,
            }).eachPage(function page(records, fetchNextPage) {
                records.forEach(function(record) {
                    clientArr.push(record);
                });
              fetchNextPage();
              }, function done(err) {
                if (err) {
                  console.error(err);
                  return;
                }
                console.log(clientArr[0]);
                if(clientArr[0]) {
                    airtableBase('Wishlist').create({
                        "Client": [clientArr[0].id],
                        "Product": [productId]
                    }, function(err, record) {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    })
                  };
                  return res.status(200).send({success: true});
             });
      } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
      }
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
