// Is the interface to something that returns strings one
// at a time, via getNext
var Spara = function(room) {
  this.room = room;
  this.locked = true;
  this.reload();
  // Current buffer
  this.cb = 1;
  // Index within that
  this.idx = 0;
};

Spara.prototype.reload = function() {
  console.log("reloading, reinitializing");
  this.buffers = [[],[],[],[],[],[],[],[],[],[]];
  this.textBuffers = ['', '', '', '', '', '', '', '', '', ''];
  this.getFromRemote();
};

Spara.prototype.showEditor = function() {
  console.log("showing.. %o %o", this.cb, this.buffers[this.cb]);
  KeyboardJS.disable();
  $('#buf-num').html("Modifica buffer: " + this.cb);
  $('#text-edit').val(this.textBuffers[this.cb]);
  $('#editor').fadeIn();
};

Spara.prototype.salva = function() {
  console.log("Saving!");
  this.setContent($('#text-edit').val());
  console.log("Set content");
  $('#editor').fadeOut();
  KeyboardJS.enable();
};

Spara.prototype.abort = function() {
  $('#editor').fadeOut();
  KeyboardJS.enable();
};

Spara.prototype.getNext = function() {
  if (this.idx >= this.buffers[this.cb].length) {
    this.idx = 0;
    if (!this.locked) {
      this.cb += 1;
      if (this.cb == 10)
        this.cb = 0;
      console.log("Setting next buffer: %o", this.cb);
    }
  }
  return this.buffers[this.cb][this.idx++];
};

Spara.prototype.reset = function() {
  this.idx = 0;
};

Spara.prototype.toggleLock = function() {
  console.log("Invocata toggleLock");
  this.locked = !this.locked;
  SparaConcetti.message(this.locked ? 'Locked' : 'Unlocked');
};

// Sets content of buf (current if not specified) to txt;
// Invoked by drag or Save
Spara.prototype.setContent = function(txt, buf) {
  var bts = buf || this.cb;
  this.textBuffers[bts] = txt;
  this.buffers[bts] = this.tokenize(txt);
  this.saveToRemote(bts);
  this.idx = 0;
};

Spara.prototype.tokenize = function(txt) {
  console.log("fuck.. %o", txt);
  if (!txt) return [];
  return txt.split(/\s+/);
};

// Changed buffer to n
Spara.prototype.changeBuffer  = function(num) {
  this.cb = num;
  this.idx = 0;
  SparaConcetti.message("Buf: " + num);
};

// Saves n buf to remote
Spara.prototype.saveToRemote = function(bufnum) {
  console.log("Saving %i to remote, content: %o", bufnum, this.buffers[bufnum]);
  $.post('/setBuffer', {
    'bufnum': bufnum,
    'room': this.room,
    'content': this.textBuffers[bufnum]
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
      console.log("Setting buffer num: %o to stuff, sized: %o",
                  bufnum,
                  item.content.length);
      if (bufnum > 0) {
        sp.textBuffers[bufnum] = item.content;
        sp.buffers[bufnum] = sp.tokenize(item.content);
      } else {
        // Il buffer 0 e' quello dei ravers. Quindi appendiamo invece di
        // sovrascrivere
        sp.textBuffers[0] = sp.textBuffers[0] + item.content;
        sp.buffers[0] = sp.buffers[0].concat(sp.tokenize(item.content));
      }
    });
  }).fail(function(err) {
    console.log("Failed: %o", err);
  }).always(function() {
    // Sarebbe il posto giusto per nascondere un loader!
    console.log("Somehow finished");
  });
};
