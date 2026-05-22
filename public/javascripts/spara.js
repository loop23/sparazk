console.log("spara.js");

class Buffer {
  constructor(text) {
    this.text = text;
    this.tokens = this.tokenize(text)
    this.idx = 0;
  }
  tokenize(txt) {
    if (!txt) return [];
    if (typeof txt === 'object') return txt;
    if (typeof txt === 'string') return txt.split(/\s+/);
    console.log("Don't know how to tokenize: %o", txt);
    return [];
  }
};

// Is the interface to something that returns strings one
// at a time, via getNext
Spara = function(room) {
  this.room = room;
  this.locked = true;
  // this.reload();
  // Current buffer
  this.currentBuffer = 1;
  // Index within that
  this.idx = 0;
  this.buffers = [[],[],[],[],[],[],[],[],[],[]];
  this.textBuffers = ['', '', '', '', '', '', '', '', '', ''];

  this.getNext = function() {
    console.log("in getNext, ho currentBuffer? %o", this.currentBuffer);
    if (this.idx >= this.buffers[this.currentBuffer].length) {
      this.idx = 0;
      if (!this.locked) {
	this.currentBuffer += 1;
	if (this.currentBuffer == 10)
          this.currentBuffer = 0;
	console.log("Setting next buffer: %o", this.currentBuffer);
      }
    }
    return this.buffers[this.currentBuffer][this.idx++];
  };

  // textBuffers is the buffer as text (useful for editing) while
  // buffers is the tokenized, array of strings one. God that sucks so much!
  this.reload = function() {
    console.log("reloading, reinitializing");
    this.buffers = [[],[],[],[],[],[],[],[],[],[]];
    this.textBuffers = ['', '', '', '', '', '', '', '', '', ''];
    this.getFromRemote();
  };

  this.showEditor = function() {
    var btext = this.buffers[this.currentBuffer];
    $('#editor').show();    
    console.log("showing.. %o %o", this.currentBuffer, btext);
    KeyboardJS.disable();
    // $('#buf-num').html("Modifica buffer: " + this.currentBuffer);
    var te = document.getElementById('text-edit');
    console.log("got text edit textarea?? %o", te);
    te.innerHTML = btext;

  };

  this.salva = function() {
    console.log("Saving!");
    this.setContent($('#text-edit').val());
    console.log("Set content");
    $('#editor').fadeOut();
    KeyboardJS.enable();
  };

  this.abort = function() {
    console.log("Called abort");
    $('#editor').fadeOut();
    KeyboardJS.enable();
  };


  this.reset = function() {
    this.idx = 0;
  };

  this.toggleLock = function() {
    console.log("Invocata toggleLock");
    this.locked = !this.locked;
    SparaConcetti.message(this.locked ? 'Locked' : 'Unlocked');
  };

  // Sets content of buf (current if not specified) to txt;
  // Invoked by drag or Save
  this.setContent = function(txt, buf) {
    var bts = buf || this.currentBuffer;
    this.textBuffers[bts] = txt;
    this.buffers[bts] = this.tokenize(txt);
    this.saveToRemote(bts);
    this.idx = 0;
  };

  // Duplicate of one in Buffer. I want to keep just that!
  this.tokenize = function(txt) {
    if (!txt) return [];
    if (typeof txt === 'object') return txt;
    if (typeof txt === 'string') return txt.split(/\s+/);
    console.log("Don't know how to tokenize: %o", txt);
    return [];
  }


  // Changed buffer to n
  this.changeBuffer  = function(num) {
    this.currentBuffer = num;
    this.idx = 0;
    SparaConcetti.message("Buf: " + num);
  };

  // Saves n buf to remote
  this.saveToRemote = function(bufnum) {
    console.log("Not really Saving %i to remote, content: %o", bufnum, this.buffers[bufnum]);
    return;
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
  this.getFromRemote = function() {
    var sp = this;
    console.log("Not Loading from remote");
    return;
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
};

