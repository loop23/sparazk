// Is the interface to something that returns strings one
// at a time, via getNext
var Spara = function() {
  this.cc = ['This', 'Is', 'a', 'lame', 'test'];
  this.idx = 0;
  return this;
};

Spara.prototype.getNext = function() {
  if (this.idx >= this.cc.length) this.idx = 0;
  return this.cc[this.idx++];
};

Spara.prototype.reset = function() {
  this.idx = 0;
};

Spara.prototype.setContent = function(txt) {
  this.cc = this.tokenize(txt);
  this.idx = 0;
};

Spara.prototype.tokenize = function(txt) {
  return txt.split(/\s+/);
};
