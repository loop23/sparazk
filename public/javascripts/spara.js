// Is the interface to something that returns strings one
// at a time, via getNext
var Spara = function(room) {
  this.room = room;
  console.log("Initialized with room: %o", room);
  this.buffers = [['buf0'],
                  ['buf1'],
                  ['buf2'],
                  ['buf3'],
                  ['buf4'],
                  ['buf5'],
                  ['buf6'],
                  ['buf7'],
                  ['buf8'],
                  ['buf9']];
  this.getFromRemote();
  // Current buffer
  this.cb = 1;
  // Index within that
  this.idx = 0;
};

Spara.prototype.getNext = function() {
  if (this.idx >= this.buffers[this.cb].length) this.idx = 0;
  return this.buffers[this.cb][this.idx++];
};

Spara.prototype.reset = function() {
  this.idx = 0;
};

// Sets content of buf (current if not specified) to txt;
// Invoked by drag
Spara.prototype.setContent = function(txt, buf) {
  var bts = buf || this.cb;
  this.buffers[bts] = this.tokenize(txt);
  this.saveToRemote(bts);
  if (buf === undefined)
    this.idx = 0;
};

Spara.prototype.tokenize = function(txt) {
  return txt.split(/\s+/);
};

// Changed buffer to n
Spara.prototype.setBuffer  = function(num) {
  this.cb = num;
  this.idx = 0;
};

// Saves n buf to remote
Spara.prototype.saveToRemote = function(bufnum) {
  console.log("Saving %i to remote, content: %o", bufnum, this.buffers[bufnum]);
  $.post('/setBuffer', {
    'bufnum': bufnum,
    'room': this.room,
    'content': JSON.stringify(this.buffers[bufnum])
  }, function() {
    console.log("Success");
  }).fail(function() {
    console.log("Failed!");
  });
};

// Retrieves file in this->room from remote
Spara.prototype.getFromRemote = function() {
  var sp = this;
  console.log("Loading from remote");
  $.get('/getRoomContent', {
    'room': this.room
  }, function(data) {
    console.log("Remote loaded");
    data.forEach(function(item) {
      var bufnum = parseInt(item.num);
      console.log("Setting buffer num: %o to stuff starting with %o",
                  bufnum,
                  item.content[0]);
      if (bufnum > 0)
        sp.buffers[bufnum] = item.content;
      else {
        // Il buffer 0 e' quello dei ravers. Quindi appendiamo invece di
        // sovrascrivere
        if (!sp.buffers[bufnum])
          sp.buffers[bufnum] = [];
        sp.buffers[bufnum].push(item.content);
      }
    });
  }).fail(function(err) {
    console.log("Failed: %o", err);
  }).always(function() {
    // Sarebbe il posto giusto per nascondere un loader!
    console.log("Somehow finished");
  });
};
