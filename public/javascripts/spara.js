// Is the interface to something that returns strings one
// at a time, via getNext
var Spara = function(room) {
  this.room = room;
  console.log("Initialized with room: %o", room);
  this.buffers = [['0', 'This', 'Is', 'a', 'lame', 'test', 'buffer'],
                  ['1', 'This', 'Is', 'a', 'lame', 'test', 'buffer', '1'],
                  ['2', 'This', 'Is', 'a', 'lame', 'test', 'buffer', '2'],
                  ['3'],
                  ['4'],
                  ['5'],
                  ['6'],
                  ['7'],
                  ['8'],
                  ['9'],
                 ];
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
