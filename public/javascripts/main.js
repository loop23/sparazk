console.log("Starting main");
var SparaConcetti = {
  // Funzione che smessaggia
  message: function(txt) {
    console.log("mostro messagigo");
    $('#bpm').html(txt).show();
    window.setTimeout(function() {
      $('#bpm').fadeOut(100);
    }, 300);
  }
};

var roomNumber = window.location.href.match(/room=(.+)/)[1];
SparaConcetti.spara = new Spara(roomNumber);
SparaConcetti.vista = new Vista(SparaConcetti.spara, $('div#main'));

var holder = $('body')[0],
    state = $('#status');
if (typeof window.FileReader === 'undefined') {
  state.addClass('fail');
} else {
  // File API & FileReader available, drag text files to
  // change what is being shot
  state.addClass('success');
  state.html('');
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
    };
    console.log(file);
    reader.readAsText(file,"UTF-8");
    return false;
  };
};

function setBufKey(key) {
  KeyboardJS.on(key.toString(), function() {
    SparaConcetti.spara.changeBuffer(key);
  });
}
KeyboardJS.on('plus', function() {
  SparaConcetti.vista.speedPlus();
});
KeyboardJS.on('-', function() {
  SparaConcetti.vista.speedMinus();
});

if (!window.location.href.match(/(sparasimple|sendOne)/)) {
  console.log("Non contiene sparasimple, setto tastiera");
  for (var i = 0; i < 10; i++) {
    setBufKey(i);
  };

  KeyboardJS.on('h', function() {
    $('#help').toggle();
  });

  KeyboardJS.on('d', function() {
    $('#main').toggleClass('anaglyph');
  });

  KeyboardJS.on('s', function() {
    SparaConcetti.vista.toggleSpara();
  });

  KeyboardJS.on('e', function() {
    SparaConcetti.spara.showEditor();
  });

  KeyboardJS.on('l', function() {
    SparaConcetti.spara.toggleLock();
  });
  KeyboardJS.on('t', function() {
    SparaConcetti.vista.tapTempo();
  });
  KeyboardJS.on('r', function() {
    SparaConcetti.spara.reload();
    SparaConcetti.message("Reloaded");
  });
}

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
