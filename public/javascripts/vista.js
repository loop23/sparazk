var Vista = function(spara, dom_id) {
  var show = false;
  this.bpm = 180;
  this.tick = function() {
    if (show)
      dom_id.text(spara.getNext()).fadeIn(30000/this.bpm/2);
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
  this.restartTimer = function() {
    console.log("Restarting, bpm to %o", this.bpm);
    if (this.timerId) {
     window.clearInterval(this.timerId);
     this.timerId = undefined;
    }
    this.timerId = window.setInterval(this.tick, 60000/this.bpm);
    $('#bpm').html(this.bpm).fadeIn(40);
    window.setTimeout(function() {
      $('#bpm').fadeOut(40);
    }, 40);
  };
  this.restartTimer();
  console.log("Initialized, timer: %i, dom_id: %o", this.timerId, dom_id);
};
