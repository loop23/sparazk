console.log("Starting main");
var SparaConcetti = {};
SparaConcetti.spara = new Spara('23');
console.log("spara setup");
SparaConcetti.vista = new Vista(SparaConcetti.spara, $('div#main'));
console.log("vista setup");

var holder = $('body')[0],
    state = $('#status')[0];
if (typeof window.FileReader === 'undefined') {
  state.className = 'fail';
} else {
  state.className = 'success';
  state.innerHTML = 'File API & FileReader available, drag text files to change what is being shot';
}

holder.ondragover = function () { this.className = 'hover'; return false; };
holder.ondragend = function () { this.className = ''; return false; };
holder.ondrop = function (e) {
  this.className = '';
  e.preventDefault();
  for (var i = 0; i < e.dataTransfer.files.length; i++) {
    var file = e.dataTransfer.files[i],
        reader = new FileReader();
    reader.onload = function (event) {
      SparaConcetti.spara.setContent(event.target.result, i);
      // state.innerHTML = '';
      // holder.style.background = 'url(' + event.target.result + ') no-repeat center';
    };
    console.log(file);
    reader.readAsText(file,"UTF-8");
    return false;
  };
};

for (var i = 0; i < 10; i++) {
  setBufKey(i);
};

function setBufKey(key) {
  console.log("Setting %o", key);
  KeyboardJS.on(key.toString(), function() {
    console.log("Setting buffer %i", key);
    SparaConcetti.spara.setBuffer(key);
  });
}

KeyboardJS.on('h', function() {
  $('#help').toggle();
});

KeyboardJS.on('s', function() {
  SparaConcetti.vista.toggleSpara();
});

// Reposition text in center
$(function() {
  $(window).on('resize', function resize()  {
    $(window).off('resize', resize);
    window.setTimeout(function () {
      var content = $('#main');
      var top = (window.innerHeight - content.height()) / 2;
      content.css('top', Math.max(0, top) + 'px');
      $(window).on('resize', resize);
    }, 50);
  }).resize();
});
