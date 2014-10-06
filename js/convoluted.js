(function() {
  navigator.getUserMedia = (
    navigator.getUserMedia || 
      navigator.webkitGetUserMedia || 
      navigator.mozGetUserMedia || 
      navigator.msGetUserMedia);

var video = document.getElementsByTagName('video')[0];
var fps = document.getElementById('fps');
var inCanvas = document.getElementById("input");
var inCtx = inCanvas.getContext('2d');
var outCanvas = document.getElementById("output");
var outCtx = outCanvas.getContext('2d');
var kernEl = document.getElementById('kernel');
var addKernEl = document.getElementById('add-kernel');
var presetEl = document.getElementById('presets');
var factorEl = document.getElementById('factor')
var biasEl = document.getElementById('bias')
var kernEls = document.getElementById('kernels');
var kernelMatrixEl = document.getElementById('kernel-matrix');
var kernelXel = document.getElementById('kernel-x');
var kernelYel = document.getElementById('kernel-y');

var factor = 1, bias = 0;

Object.keys(presets).forEach(function(preset) {
  var opt = document.createElement('option');
  opt.value = preset;
  opt.innerText = presets[preset].name || preset;
  presetEl.appendChild(opt);
});

factorEl.addEventListener('change', function() {
  console.log('factor change', this.value);
  factor = parseFloat(this.value);
});

biasEl.addEventListener('change', function() {
  console.log('bias change', this.value);
  bias = parseFloat(this.value);
});

var preset = 'laplacianOfGaussian5X5';
var kernel = presets[preset].kernel;
presetEl.value = preset;

var X = 5;
var Y = 5;

var kernelHTML = function() {
  var rows = kernEl.querySelectorAll('fieldset');

  kernelXel.value = X;
  kernelYel.value = Y;

  for (var i = 0; i < rows.length; i++) {
    rows[i].remove();
  }

  for(var y = 0; y < Y; y++) {
    var fs = document.createElement('fieldset');

    for(var x=0; x < X; x++) {
      var input = document.createElement('input');
      input.type = 'number';
      input.step = 'any';
      input.value = kernel[y] ? (kernel[y][x] ? kernel[y][x] : 0) : 0;
      fs.appendChild(input)

    }
    
    kernelMatrixEl.appendChild(fs);
    
  }
};

kernelHTML();

kernelXel.addEventListener('change', function() {
  X = parseInt(this.value);
  console.log('kernel size change', X, Y);
  kernelHTML();
});

kernelYel.addEventListener('change', function() {
  Y = parseInt(this.value);
  console.log('kernel size change', X, Y);
  kernelHTML();
});

presetEl.addEventListener('change', function() {
  kernel = presets[
    presetEl.options[presetEl.selectedIndex].value
  ];

  factor = 1;
  bias = 0;

  if (!(kernel instanceof Array)) {
    console.log("yeah! object!");
    factor = kernel.factor || 1;
    bias = kernel.bias || 0;
    kernel = kernel.kernel;
  }

  factorEl.value = factor;
  biasEl.value = bias;

  X = kernel[0].length;
  Y = kernel.length;
  kernelHTML();

  var rows = kernEl.getElementsByTagName('fieldset');
  //var inputs = kernEl.getElementsByTagName('input');

  for(var i=0; i < rows.length; i++) {
    var inputs = rows[i].children;
    for(var j=0; j < inputs.length; j++) {
      inputs[j].value = kernel[i][j];
    }
  }

});

var identity = [
  [ 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0 ],
  [ 0, 0, 1, 0, 0 ],
  [ 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0 ]
];

var kernels = [kernel];

addKernEl.addEventListener('change', function() {
  console.log('add kernel!');
  kernel = identity;
  kernels.push(kernel);
});

kernEl.addEventListener('change', function() {
  console.log('kernel change');

  var rows = kernEl.querySelectorAll('fieldset');
  kernel = [];

  for(var i=0; i < rows.length; i++) {
    kernel[i] = [];
    var inputs = rows[i].children;
    for(var j=0; j < inputs.length; j++) {
      kernel[i].push(parseFloat(inputs[j].value));
    }
  }

  kernels[kernels.length - 1] = kernel;
  console.log(kernel);
});

var canvasWidth = 160;
var canvasHeight = 120;

//document.getElementById('enable-cam').addEventListener('click', function(event) {
//  event.preventDefault();
  navigator.getUserMedia({ video: true, audio: false }, function(stream) {
    var url = window.URL || window.webkitURL;
    video.src = url ? url.createObjectURL(stream) : stream;
    //video.play();
  }, function(err) {
    console.log('error with stream!', err);
  });
//});
  
video.addEventListener('canplay', function(event) {
  console.log('canplay', event);
  aspectRatio = video.videoWidth / video.videoHeight;
  console.log('video w/h', video.videoWidth, video.videoHeight);
  console.log(video);
  inCanvas.width = outCanvas.width = canvasWidth = video.videoWidth;// / 4;
  inCanvas.height = outCanvas.height = canvasHeight = video.videoHeight;// / 4;
  console.log('canvasWidth', canvasWidth, outCanvas.width);
  console.log('canvasHeigt', canvasHeight, outCanvas.height);
  //mirror the video
  inCtx.translate(canvasWidth, 0);
  inCtx.scale(-1, 1);
  video.play();
});


var box = [0, 0];

outCanvas.addEventListener('mousemove', function(event) {

  var rect = outCanvas.getBoundingClientRect();
  
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;

  //console.log('mouse over', x, y, rect);

  x = x * outCanvas.width / rect.width;
  y = y * outCanvas.height / rect.height;

  box = [x, y];

});

video.addEventListener('play', function() {
  console.log('play', video.videoWidth, video.videoHeight);
  var animate = function() {
    if (video.paused || video.ended) return;
    //console.log(video);
    inCtx.fillRect(0, 0, canvasWidth, canvasHeight);
    try {
      inCtx.drawImage(video, 0, 0, canvasWidth, canvasHeight);
    } catch (err) {
      
      return requestAnimationFrame(animate);      
    }
    fps.innerHTML = Math.round(1000 / ((new Date).getTime() - lastFrameTime));
    lastFrameTime = (new Date).getTime();
      
    var imageData = inCtx.getImageData(0, 0, canvasWidth, canvasHeight);
    var data = imageData.data;

    //B&W
    /*
    for(var i = 0; i < data.length; i += 4) {
      var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
      // red
      data[i] = brightness;
          // green
      data[i + 1] = brightness;
      // blue
      data[i + 2] = brightness;
    }
    */

    var f = new Filter(kernel);
    f.width(canvasWidth);
    f.height(canvasHeight);
    f.factor(factor);
    f.bias(bias);

    var out = inCtx.createImageData(canvasWidth, canvasHeight);
    f.apply(imageData, out);

    //outCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    //outCtx.stroke();
    //outCtx.clear();
    //outCtx.clearRect(0, 0, outCanvas.width, outCanvas.height);
    
    outCtx.putImageData(out, 0, 0);
    //outCtx.fillStyle = 'red';
    //outCtx.fillRect(box[0], box[1], X, Y);
    
    boxData = inCtx.getImageData(parseInt(box[0]), parseInt(box[1]), X, Y).data;
    //console.log(box[0], box[1], X, Y);
    //console.log(boxData.length);

    /*
    var inputs = kernEl.querySelectorAll('fieldset input');
    for (var i=0; i < inputs.length; i++) {
      inputs[i].style.backgroundColor = 'rgba(' + [
        boxData[i*4],
        boxData[i*4 + 1],
        boxData[i*4 + 2],
        '0.5'
      ].join(',') + ')';
    }
    */

    //outCtx.strokeStyle = 'red';
    //outCtx.strokeRect(parseInt(box[0]), parseInt(box[1]), X, Y);
                
    //outCtx.putImageData(imageData, 0, 0);
    requestAnimationFrame(animate);
  }
  var lastFrameTime = (new Date).getTime();
  requestAnimationFrame(animate);
  
}, false);
  
  document.addEventListener("keydown", function(event) {
    if(event.keyCode === 32) {
      event.preventDefault();
      var url = outCanvas.toDataURL('image/png');
      window.open(url);
    }
  });

})();
