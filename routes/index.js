const express = require('express');
const crypto = require('crypto');
const urlsafe = require('node-base64-urlsafe');

const router = express.Router();

/** Sync */
function randomStringAsBase64Url(size) {
  return urlsafe.encode(crypto.randomBytes(size));
}

/* GET home page. */
router.get('/', (req, res) => {
  const newroom = urlsafe.randomStringAsBase64Url(20);
  // var newroom = 666;
  // res.redirect('/sparasimple?room=' + newroom);
  res.redirect(`/spararoom?help=true&room=${newroom}`);
});

router.get('/sparasimple*', ({ req: { query: { room } } }, res, next) => {
  res.render('simple', {
    title: `SparaConcetti Rave Edition - room: ${room}`,
    room: room,
  });
});

router.post('/', ({ req: { query: { room, help } } }, res) => {
  // console.log('Geezer logged in from fb');
  if (room) {
    const hidehelp = help !== 'true';
    console.log('Got room: %o, rendering, hidehelp: %o', room, hidehelp);
    res.render('index', {
      title: `SparaConcetti Rave Edition - room: ${room}`,
      room,
      hidehelp,
    });
  } else {
    res.redirect('/');
  }
});

router.get('/spararoom*', ({ req: { query: { room, help } } }, res) => {
  if (room) {
    const hidehelp = help !== 'true';
    console.log('Got room: %o, rendering, hidehelp: %o', room, hidehelp);
    res.render('index', {
      title: `SparaConcetti Rave Edition - room: ${room}`,
      room,
      hidehelp,
    });
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
      'userlist' : docs
    });
  });
});
*/
router.get('/getRoomContent', ({
  req: {
    query: {
      room, db
    }
  }
}, res) => {
  const collection = db.get('buffers');
  // console.log('Querying in room %o', room);
  collection.find({ room }).then((docs) => {
    // console.log('Got some docs: %o', docs.length);
    res.send(docs);
  }).catch((err) => {
    // console.log('Error getting room content: %o', err);
  });
});

/* GET New User page. */
/*
router.get('/newuser', function(req, res) {
  res.render('newuser', { title: 'Add New User' });
});
*/
// Questa e' usata dalla simple. Non cancella
router.post('/sendOne', (req, res) => {
  const db = req.db;
  const room = req.body.room || 666;
  const text = req.body.text;
  // console.log('Inserisco %o in %o', text, room);
  const collection = db.get('buffers');
  collection.insert({
    room,
    num: 0,
    content: text,
  }).then((docs) => {
    res.render('simple', {
      title: `SparaConcetti Rave Edition - room: ${room}`,
      room,
      message: 'Frase registrata, pronti a sparare!',
    });
  }).catch((err) => {
    console.log('wooops - %o', err);
    res.status(500).send({
      error: 'Non sono riuscito ad inserire il testo.. sorry!',
    });
  });
});

// Questa e' invocata dalla console principale; no simple
router.post('/setBuffer', (req, res) => {
  const db = req.db;
  const bufnum = req.body.bufnum;
  const room = req.body.room;
  const content = req.body.content;
  const collection = db.get('buffers');
  // Se c'e' gia', spianalo
  console.log('Rimuovo in %o, num: %o', room, bufnum);
  collection.remove({
    room,
    num: bufnum,
  }).then((docs) => {
    console.log('rmoved! %o', docs.deletedCount);
  }).catch((err) => {
    console.log('Cannot remove docs, err: %o', err);
  });
  collection.insert({
    room,
    num: bufnum,
    content,
  }).then((docs) => {
    // docs contains the documents inserted with added **_id** fields;
    // not that we really use it!
    res.status(201).end();
  }).catch((err) => {
    // An error happened while inserting
    console.log('Cannot write to db: %o', err);
    res.status(500).send({
      error: 'There was a problem persisting data to the database',
      exception: err,
    });
  });
});

/* POST to Add User Service */
/*
router.post('/adduser', function(req, res) {
    // Set our internal DB variable
    var db = req.db;
    // Get our form values. These rely on the 'name' attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;
    // Set our collection
    var collection = db.get('usercollection');
    // Submit to the DB
    collection.insert({
        'username' : userName,
        'email' : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send('There was a problem adding the information to the database.');
        } else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location('userlist');
            // And forward to success page
            res.redirect('userlist');
        }
    });
});
*/
module.exports = router;
