console.log("spara.js");


// Is the interface to something that returns strings one
// at a time, via getNext
Spara = function(room) {
  this.room = room;
  this.locked = true;
  // this.reload();
  // Current buffer
  this.currentBufferNum = 1;
  this.buffers = [];
  for (i = 0; i<10; i++) {
    this.buffers.push(new SparaBuffer(`Buffer-${i}-vuoto!`));
  }

  this.currentBuffer = function() {
    return this.buffers[this.currentBufferNum];
  }

  this.getNext = function() {
    // console.log("in getNext, ho currentBufferNum? %o", this.currentBufferNum);
    var next = this.currentBuffer().getNext();
    if (next) {
      return next;
    }
    if (!this.locked) {
      console.log("not locked tutto da vedere!");
      this.currentBufferNum += 1;
      if (this.currentBufferNum == 10)
        this.currentBufferNum = 0;
      console.log("Setting next buffer: %o", this.currentBufferNum);
    }
    return this.currentBuffer().getNext();
  };

  // textBuffers is the buffer as text (useful for editing) while
  // buffers is the tokenized, array of strings one. God that sucks so much!
  this.reload = function() {
    console.log("reloading, reinitializing");
    this.buffers = [];
    this.getFromRemote();
  };

  this.showEditor = function() {
    document.querySelector('#editor').style.display = 'block';
    KeyboardJS.disable();
    this.toggleLock(true); // otherwise it keeps going!
    var btext = this.currentBuffer().text;
    console.log("editing number %o %o", this.currentBufferNum, btext);
    var te = document.querySelector('#text-edit');
    te.value = btext;
    te.innerText = btext;
    console.log("quindi vale? %o", te.value);
  };

  this.saveClicked = function() {
    var elem = document.getElementById('text-edit');
    if (!elem) {
      console.error("Cannot find #text-edit, cannot save");
      return;
    }
    console.log("Saving!, setting content to %s", elem.value);
    this.setContent(elem.value);
    this.closeEditor();
  };

  this.abortClicked = function() {
    console.log("Called abortClicked");
    this.closeEditor();
  };

  this.closeEditor = function() {
    document.getElementById('editor').style.display = 'none';
    KeyboardJS.enable();
  }

  this.reset = function() {
    this.currentBuffer().reset();
  };

  this.toggleLock = function(lockstate) {
    console.log("Invocata toggleLock");
    if (lockstate == undefined)
      this.locked = !this.locked;
    else
      this.locked = lockstate;
    SparaConcetti.message(this.locked ? 'Locked' : 'Unlocked');
  };

  // Sets content of buf (current if not specified) to txt;
  // Invoked by drag or Save
  this.setContent = function(txt, bufnum) {
    var bts = bufnum || this.currentBufferNum;
    console.log("setContent on buffer %i", bts);
    this.buffers[bts] = new SparaBuffer(txt);
    this.saveToRemote(bts);
  };

    

  // Changed buffer to n
  this.changeBuffer  = function(num) {
    this.currentBufferNum = num;
    this.currentBuffer().reset();
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

