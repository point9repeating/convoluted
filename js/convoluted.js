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
  updateKernel({ factor: parseFloat(this.value) });
});

biasEl.addEventListener('change', function() {
  updateKernel({ bias: parseFloat(this.value) });
});

kernEl.addEventListener('submit', function(event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
});

var preset = 'laplacianOfGaussian5X5';
var kernel = presets[preset];
presetEl.value = preset;

if(window.location.hash) {
  try {
    kernel = JSON.parse(window.location.hash.slice(2));
  } catch(err) {
    console.error(err);
  }
}

var kernelKeys = [
  "filter",
  "factor",
  "bias"
];

var updateKernel = function(opts, updateDOM) {
  var rows = kernEl.querySelectorAll('fieldset');
  kernelKeys.forEach(function(key) {
    if(opts[key] !== undefined) {
      kernel[key] = opts[key];
    }
  });

  var filter = kernel.filter;
  var X = kernelXel.value = filter[0].length;
  var Y = kernelYel.value = filter.length;
  factorEl.value = kernel.factor;
  biasEl.value = kernel.bias;

  window.location.hash = '#!' + JSON.stringify(kernel);

  if(!updateDOM) {
    return;
  }

  for (var i = 0; i < rows.length; i++) {
    rows[i].remove();
  }

  for(var y = 0; y < Y; y++) {
    var fs = document.createElement('fieldset');

    for(var x=0; x < X; x++) {
      var input = document.createElement('input');
      input.type = 'number';
      input.step = 'any';
      input.value = filter[y] ? (filter[y][x] ? filter[y][x] : 0) : 0;
      fs.appendChild(input)
    }
    
    kernelMatrixEl.appendChild(fs);
  }
};

updateKernel(kernel, true);

kernelXel.addEventListener('change', function() {
  X = parseInt(this.value);
  var filter = kernel.filter;
  var diff = filter[0].length - X;

  filter.forEach(function(row, i) {
    if(diff > 0) {
      row = row.slice(diff / 2, row.length - diff/2);
    } else {
      var a = new Array(-diff/2).map(function() { return 0; });
      row = a.concat(row).concat(a);
    }
    filter[i] = row;
  });
  
  updateKernel({ filter: filter }, true);
});

kernelYel.addEventListener('change', function() {
  var Y = parseInt(this.value);
  var filter = kernel.filter;
  var diff = filter.length - Y;
  var a = Array.apply(null, new Array(filter[0].length)).map(Number.prototype.valueOf,0);

  if(diff > 0) {
    filter = filter.slice(diff / 2, filter.length - diff/2);
  } else {
    for(var i=0; i < -diff / 2; i++) {
      filter = [a].concat(filter);
      filter.push(a);
    }
  }

  updateKernel({ filter: filter }, true);
});

presetEl.addEventListener('change', function() {
  updateKernel(presets[
    presetEl.options[presetEl.selectedIndex].value
  ], true);
});

kernEl.addEventListener('change', function() {
  var rows = kernEl.querySelectorAll('fieldset');
  var filter = [];

  for(var i=0; i < rows.length; i++) {
    filter[i] = [];
    var inputs = rows[i].children;
    for(var j=0; j < inputs.length; j++) {
      filter[i].push(parseFloat(inputs[j].value));
    }
  }

  updateKernel({ filter: filter });

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
  aspectRatio = video.videoWidth / video.videoHeight;
  inCanvas.width = outCanvas.width = canvasWidth = video.videoWidth;// / 4;
  inCanvas.height = outCanvas.height = canvasHeight = video.videoHeight;// / 4;
  //mirror the video
  inCtx.translate(canvasWidth, 0);
  inCtx.scale(-1, 1);
  video.play();
});

var box = [0, 0];

/*
outCanvas.addEventListener('mousemove', function(event) {

  var rect = outCanvas.getBoundingClientRect();
  
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;

  x = x * outCanvas.width / rect.width;
  y = y * outCanvas.height / rect.height;

  box = [x, y];

});
*/

video.addEventListener('play', function() {
  var animate = function() {
    if (video.paused || video.ended) return;
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

    /*
    //B&W
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
    
    var f = new Filter(kernel.filter);
    f.width(canvasWidth);
    f.height(canvasHeight);
    f.factor(kernel.factor);
    f.bias(kernel.bias);

    var out = inCtx.createImageData(canvasWidth, canvasHeight);
    f.apply(imageData, out);

    outCtx.putImageData(out, 0, 0);
    
    //boxData = inCtx.getImageData(parseInt(box[0]), parseInt(box[1]), X, Y).data;

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
