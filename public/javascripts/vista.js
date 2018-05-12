var Vista = function(spara, dom_id) {
  var show = false;
  this.bpm = 180;
  this.lastTap = null;
  this.tick = function() {
    if (show) {
      var nt = spara.getNext();
      dom_id.text(nt).fadeIn(30000/this.bpm/1.3);
    }
    else
      dom_id.fadeOut(30000/this.bpm/1.3);
    show = !show;
  }.bind(this);
  this.toggleSpara = function() {
    if (this.timerId) {
      console.log("Stopping");
      window.clearInterval(this.timerId);
      this.timerId = undefined;
    } else {
      console.log("Starting");
      this.restartTimer();
    }
  };
  this.speedPlus = function(amt) {
    if (!amt) amt = 1;
    this.bpm = this.bpm + amt;
    if (this.bpm > 400) this.bpm = 400;
    this.restartTimer();
  };
  this.speedMinus = function(amt) {
    if (!amt) amt = 1;
    this.bpm = this.bpm - amt;
    if (this.bpm < 5) this.bpm = 5;
    this.restartTimer();
  };
  this.tapTempo = function() {
    var now = new Date().valueOf();
    var tdiff = now - this.lastTap;
    if (tdiff > 130 && tdiff < 2000) {
      console.log("Sembra sensato, diff: %o", tdiff);
      this.bpm = 30000 / tdiff;
      this.restartTimer();
    };
    this.lastTap = now;
  },
  this.restartTimer = function() {
    console.log("Restarting, bpm to %o", this.bpm);
    if (this.timerId) {
     window.clearInterval(this.timerId);
     this.timerId = undefined;
    }
    this.timerId = window.setInterval(this.tick, 30000/this.bpm);
    SparaConcetti.message("BPM: " + this.bpm);
  };
  this.restartTimer();
  console.log("Initialized, timer: %i, dom_id: %o", this.timerId, dom_id);
};
