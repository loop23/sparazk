var spara = new Spara();
var vista = new Vista(spara, $('div#main'));

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
  var file = e.dataTransfer.files[0],
      reader = new FileReader();
  reader.onload = function (event) {
    spara.setContent(event.target.result);
    // state.innerHTML = '';
    // holder.style.background = 'url(' + event.target.result + ') no-repeat center';
  };
  console.log(file);
  reader.readAsText(file,"UTF-8");
  return false;
};

for (var i = 0; i < 10; i++) {
  setK(i);
};

function setK(key) {
  KeyboardJS.on(key.toString(), function() {
    console.log("Setting buffer %i", key);
    spara.setBuffer(key);
  });
}

$(function() {
  $(window).on('resize', function resize()  {
    $(window).off('resize', resize);
    setTimeout(function () {
      var content = $('#main');
      var top = (window.innerHeight - content.height()) / 2;
      content.css('top', Math.max(0, top) + 'px');
      $(window).on('resize', resize);
    }, 50);
  }).resize();
});
