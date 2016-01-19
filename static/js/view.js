function init() {
  var $main = document.getElementById('main');

  var page = new ViewPage();
  $main.appendChild(page.$el);

  page.render();
}

document.body.onload = init;


// // function on_seek(t) {
// //     $a.currentTime = t;
// // }

// // window.onkeydown = function(ev) {
// //     if(ev.keyCode == 32) {      // space bar
// //         ev.preventDefault();
// //         if($a.paused) {
// //             $a.play();
// //         }
// //         else {
// //             $a.pause();
// //         }
// //     }
// // }

// // function tick() {
// //     timeline.set_t($a.currentTime, $a.paused);
// //     window.requestAnimationFrame(tick);
// // }

// // var timeline, zoombar, $a;
// function init() {
//   var $main = document.getElementById('main');

//   var timeline = new Timeline();
//   $main.

//   // $a = document.createElement("audio");
//   // $a.type = 'audio/wav';
//   // $a.src = '/blobs/' + data.playback_id;

//   // var words = [];

//   // $main.innerHTML = "";

//   // var $header = document.createElement('h1');
//   // $header.innerText = data.name;
//   // $main.appendChild($header);

//   // timeline = new Timeline(words, data.pitches.freq_hz, data.pitches.p_voiced, on_seek);
//   // $main.appendChild(timeline.$el);

//   // zoombar = new ZoomBar(function(amnt) {
//   //     timeline.set_scale_x(50 + amnt*250);
//   // });
//   // zoombar.$el.style.left = 700;
//   // zoombar.$el.style.top = 500;
//   // $main.appendChild(zoombar.$el);

//   // var $downloadButton = document.createElement('a');
//   // $downloadButton.innerText = 'Download CSV';
//   // $downloadButton.className = 'download-button';
//   // $downloadButton.href = data.id + '.csv';
//   // $main.appendChild($downloadButton);

//   // tick();
// }
// init();