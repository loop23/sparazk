var Vista = function(spara, dom_id) {
  var show = false;
  this.tick = function() {
    if (show)
      dom_id.text(spara.getNext()).fadeIn();
    else
      dom_id.fadeOut();
    show = !show;
  }.bind(this);
  this.timerId = window.setInterval(this.tick, 500);
  console.log("Initialized, timer: %i, dom_id: %o", this.timerId, dom_id);
};
