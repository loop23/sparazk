var express = require('express');
var router = express.Router();

/** Sync */
function randomStringAsBase64Url(size) {
  var crypto = require('crypto');
  return require('node-base64-urlsafe').encode(crypto.randomBytes(size));
}

/* GET home page. */
router.get('/', function(req, res, next) {
  // var newroom = randomStringAsBase64Url(20);
  var newroom = 666;
  res.redirect('/spararoom?help=true&room=' + newroom);
});

router.get('/sparasimple*', function(req, res, next) {
  var room = req.query.room;
  res.render('simple',
             {
               'title': 'SparaConcetti Rave Edition - room:' + room,
               'room': room
             });
});

router.post('/', function(req, res, next) {
  console.log("Geezer logged in from fb");
  var room = req.query.room;
  if (room) {
    var hidehelp = req.query.help != 'true';
    console.log("Got room: ", room, "rendering, hidehelp: " + hidehelp);
    res.render('index', { 'title': 'SparaZK - room:' + room,
                          'room': room,
                          'hidehelp': hidehelp });
  } else {
    res.redirect('/');
  }
});

router.get('/spararoom*', function(req, res, next) {
  var room = req.query.room;
  if (room) {
    var hidehelp = req.query.help != 'true';
    console.log("Got room: ", room, "rendering, hidehelp: " + hidehelp);
    res.render('index', { 'title': 'SparaZK - room:' + room,
                          'room': room,
                          'hidehelp': hidehelp });
  } else {
    res.redirect('/');
  }

});

/* GET Userlist page. */
/*
router.get('/userlist', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({},{},function(e,docs){
    res.render('userlist', {
      "userlist" : docs
    });
  });
});
*/
router.get("/getRoomContent", function(req, res) {
  var room = req.query.room;
  var db = req.db;
  var collection = db.get("buffers");
  console.log("Querying in room %o", room);
  collection.find({room: room }).then((docs) => {
    console.log("Got some docs:", docs.length);
    res.send(docs);
  }).catch((err) => {
    console.log("Error getting room content: %o", err);
  });
});

/* GET New User page. */
/*
router.get('/newuser', function(req, res) {
  res.render('newuser', { title: 'Add New User' });
});
*/
// Questa e' usata dalla simple. Non cancella
router.post('/sendOne', function(req, res) {
  var db = req.db;
  var room = req.body.room || 666;
  var text = req.body.text;
  console.log("Inserisco %o in %o", text, room);
  var collection  = db.get('buffers');
  collection.insert({
    "room": room,
    "num": 0,
    "content": text.split(/(\s+|\w{20}/)
  }).then((docs) => {
    res.render('simple',
               {
                 'title': 'SparaConcetti Rave Edition - room:' + room,
                 'room': room,
                 'message': 'Frase registrata, pronti a sparare!'
               });
  }).catch((err) => {
    console.log("wooops - %o", err);
    res.status(500).send({
      error: 'Non sono riuscito ad inserire il testo.. peccato!'
    });
  });
});

// Questa e' invocata dalla console principale; no simple
router.post('/setBuffer', function(req, res) {
  var db = req.db;
  var bufnum = req.body.bufnum;
  var room = req.body.room;
  var content = JSON.parse(req.body.content);
  var collection  = db.get('buffers');
  // Se c'e' gia', spianalo
  collection.remove({ room: room,
                      num: bufnum }).then((docs) => {
                        console.log("rmoved! %o", docs.deletedCount);
                      }).catch((err) => {
                        console.log("Can't remove docs, err: %o", err);
                      });
  collection.insert({
    room: room,
    num: bufnum,
    content: content
  }).then((docs) => {
    // docs contains the documents inserted with added **_id** fields;
    // not that we really use it!
    res.status(201).end();
  }).catch((err) => {
    // An error happened while inserting
    console.log("Cannot write to db: %o", err);
    res.status(500).send({
      error: "There was a problem persisting data to the database",
      exception: err
    });
  });
});

/* POST to Add User Service */
/*
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
*/
module.exports = router;
