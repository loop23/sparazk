// Un buffer di testo. Ha text cosi' come salvato, e tokens array di stringhe
class SparaBuffer {
  constructor(text) {
    this.text = text;
    this.tokens = this.tokenize(text)
    this.idx = 0;
  }

  reset() {
    this.idx = 0;
  }

  getNext() {
    var ret = this.peek();
    if (!ret) {
      console.debug("SparaBuffer, over size, resetting");
      this.reset();
    } else {
      this.idx += 1;
    }
    return ret;
  }

  peek() {
    return this.tokens[this.idx];
  }

  tokenize(txt) {
    if (!txt) return [];
    if (typeof txt === 'object') return txt;
    if (typeof txt === 'string') return txt.split(/\s+/);
    console.warning("Don't know how to tokenize: %o", txt);
    return [];
  }
};
