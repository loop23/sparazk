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
    state.innerHTML = '';
    // holder.style.background = 'url(' + event.target.result + ') no-repeat center';
  };
  console.log(file);
  reader.readAsText(file,"UTF-8");
  return false;
};

for(var i = '0'; i < '9'; i++) {
  KeyboardJS.on(i, function() {
    console.log("you pressed %o", i);
  });
};
