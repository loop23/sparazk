// Is the interface to something that returns strings one
// at a time, via getNext
var Spara = function(room) {
  this.room = room;
  console.log("Initialized with room: %o", room);
  this.buffers = [['buf0'],
                  ['buf1'],
                  ['buf22'],
                  ['3'],
                  ['4'],
                  ['5'],
                  ['6'],
                  ['7'],
                  ['8'],
                  ['9']];
  this.getFromRemote();
  // Current buffer
  this.cb = 0;
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

// Sets content of buf (current if not specified) to txt
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

// Retrieves file in this->room remote
Spara.prototype.getFromRemote = function() {
  var sp = this;
  console.log("Fetching from remote, this is: %o", sp);
  $.get('/getRoomContent', {
    'room': this.room
  }, function(data) {
    console.log("Got json data: %o", data);
    $.each(data, function(item) {
      var di = data[item];
      console.log("Weird, %o, setting item: %i, sp: %o", di, di.num, sp);
      sp.buffers[parseInt(di.num)] = di.content;
    }).bind(this);
  }).fail(function() {
    console.log("Failed!");
  }).always(function() {
    console.log("Somehow finished");
  });
};
