/**
 * Initialize a new `Filter` with the given `matrix`.
 *
 * @param {Array} matrix
 * @api public
 */

function Filter(matrix) {
  if (!(this instanceof Filter)) return new Filter(matrix);
  if (!matrix) throw new TypeError('convolution matrix required');
  this.matrix = matrix;
  this.factor(1);
  this.bias(0);
}

/**
 * Set width.
 *
 * @param {Number} n
 * @return {Filter}
 * @api public
 */

Filter.prototype.width = function(n){
  this.w = n;
  return this;
};

/**
 * Set height.
 *
 * @param {Number} n
 * @return {Filter}
 * @api public
 */

Filter.prototype.height = function(n){
  this.h = n;
  return this;
};

/**
 * Set factor, this may be used to
 * ensure that all matrix elements
 * produce a sum of 1.
 *
 * @param {Number} n
 * @return {Filter}
 * @api public
 */

Filter.prototype.factor = function(n){
  this._factor = n;
  return this;
};

/**
 * Set bias, this may be used to
 * brighten or darken the result.
 *
 * @param {Number} n
 * @return {Filter}
 * @api public
 */

Filter.prototype.bias = function(n){
  this._bias = n;
  return this;
};

/**
 * Apply the filter to `input` and populate `result`.
 *
 * @param {ImageData} input
 * @param {ImageData} result
 * @api public
 */

Filter.prototype.apply = function(input, result){
  var data = input.data;
  var out = result.data;
  var width = this.w;
  var height = this.h;
  var matrix = this.matrix;
  var w = matrix[0].length;
  var h = matrix.length;
  var half = Math.floor(h / 2);
  var factor = this._factor;
  var bias = this._bias;

  for (var y = 0; y < height - 1; y++) {
    for (var x = 0; x < width - 1; x++) {
      var px = (y * width + x) * 4;
      var r = 0, g = 0, b = 0;

      for (var cy = 0; cy < h; cy++) {
        for (var cx = 0; cx < w; cx++) {
          var scy = y + cy - half;
          var scx = x + cx - half;
          if(scy < 0) { scy = 0; }
          if(scy >= height) { scy = height - 1; }
          if(scx < 0) { scx =0; }
          if(scx >= width) { scx = width - 1; }

          if(scy >= 0 && scy < height && scx >= 0 && scx < width) {
            //var cpx = ((y + (cy - half)) * width + (x + (cx - half))) * 4;
            var cpx = (scy * width + scx) * 4;
            var weight = matrix[cy][cx];
            r += data[cpx] * weight;
            g += data[cpx + 1] * weight;
            b += data[cpx + 2] * weight;
          }
        }
      }

      out[px + 0] = factor * r + bias;
      out[px + 1] = factor * g + bias;
      out[px + 2] = factor * b + bias;
      //out[px + 1] = data[px + 1];
      //out[px + 2] = data[px + 2];
      out[px + 3] = data[px + 3];
      //out[px] = r//factor * r + bias;
      //out[px + 1] = g//factor * g + bias;
      //out[px + 2] = b//factor * b + bias;
      //out[px + 3] = 255//data[px + 3];
    }
  }
};

/**
 * Apply filter to the entire `canvas`.
 *
 * @param {Canvas} canvas
 * @api public
 */

Filter.prototype.canvas = function(canvas){
  var w = canvas.width;
  var h = canvas.height;
  var ctx = canvas.getContext('2d');
  var data = ctx.getImageData(0, 0, w, h);
  var result = ctx.createImageData(w, h);
  this.width(w);
  this.height(h);
  this.apply(data, result);
  ctx.putImageData(result, 0, 0);
};
