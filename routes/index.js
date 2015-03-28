var express = require('express');
var router = express.Router();

/** Sync */
function randomStringAsBase64Url(size) {
  var crypto = require('crypto');
  return require('node-base64-urlsafe').encode(crypto.randomBytes(size));
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var newroom = randomStringAsBase64Url(20);
  res.redirect('/spararoom?room=' + newroom);
});

router.get('/spararoom*', function(req, res, next) {
  var room = req.query.room;
  if (room) {
    console.log("Got room: ", room, "rendering");
    res.render('index', { title: 'SparaZK - room:' + room });
  } else {
    res.redirect('/');
  }
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});

router.post('/setBuffer', function(req, res) {
  var db = req.db;
  var bufnum = req.body.bufnum;
  var room = req.body.room;
  var content = JSON.parse(req.body.content);
  var collection  = db.get('buffers');
  collection.insert({
    "room": room,
    "num": bufnum,
    "content": content
  }, function (err, doc) {
    if (err) {
      // If it failed, return error
      res.send("There was a problem adding the information to the database.");
    } else {
      // If it worked, set the header so the address bar doesn't still say /adduser
      res.location("userlist");
      // And forward to success page
      res.redirect("userlist");
    }
  });
});
/* POST to Add User Service */
router.post('/adduser', function(req, res) {
    // Set our internal DB variable
    var db = req.db;
    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;
    // Set our collection
    var collection = db.get('usercollection');
    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        } else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("userlist");
            // And forward to success page
            res.redirect("userlist");
        }
    });
});

module.exports = router;
