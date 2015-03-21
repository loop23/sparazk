// Is the interface to something that returns strings one
// at a time, via getNext
Spara = function() {
  this.cc = ['This', 'Is', 'a', 'lame', 'test'];
  this.idx = 0;
};

Spara.prototype.getNext = function() {
  if (this.idx > this.cc.length) this.idx = 0;
  return this.cc[this.idx];
};
