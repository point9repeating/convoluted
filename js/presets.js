var presets = {

  identity3X3: {
    name: 'Identity 3 X 3',
    factor: 1,
    bias: 0,
    filter: [
      [ 0, 0, 0 ],
      [ 0, 1, 0 ],
      [ 0, 0, 0 ]
    ],
  }, 
  
  identity5X5: {
    name: 'Identity 5 X 5',
    factor: 1,
    bias: 0,
    filter: [
      [ 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0 ],
      [ 0, 0, 1, 0, 0 ],
      [ 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0 ],
    ]
  },

  identity7X7: {
    name: 'Identity 7 X 7',
    factor: 1,
    bias: 0,
    filter: [
      [ 0, 0, 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 1, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0, 0, 0 ],
    ]
  }, 

  boxblur: {
    name: 'Box Blur',
    factor: 1/9,
    bias: 0,
    filter: [
      [ 1, 1, 1 ],
      [ 1, 1, 1 ],
      [ 1, 1, 1 ],
    ]
  },
  
  gaussianblur: {
    name: 'Gaussian Blur',
    factor: 1/16,
    bias: 0,
    filter: [
      [ 1, 2, 1 ],
      [ 2, 4, 2 ],
      [ 1, 2, 1 ],
    ]
  },

  motionblur: {
    name: "Motion Blur",
    factor: 1/7,
    bias: 0,
    filter: [
      [ 1, 0, 0, 0, 0, 0, 0 ],
      [ 0, 1, 0, 0, 0, 0, 0 ],
      [ 0, 0, 1, 0, 0, 0, 0 ],
      [ 0, 0, 0, 1, 0, 0, 0 ],
      [ 0, 0, 0, 0, 1, 0, 0 ],
      [ 0, 0, 0, 0, 0, 1, 0 ],
      [ 0, 0, 0, 0, 0, 0, 1 ]
    ]
  },

  sharpen: {
    name: 'Sharpen 3 X 3',
    factor: 1,
    bias: 0,
    filter: [
      [ 0, -1, 0 ],
      [ -1, 5, -1 ],
      [ 0, -1, 0 ],
    ]
  },

  edgedetect1: {
    name: 'Edge Detect 1',
    factor: 1,
    bias: 0,
    filter: [
      [ 0, 1, 0 ],
      [ 1, -4, 1 ],
      [ 0, 1, 0 ],
    ]
  },

  edgedetect2: {
    name: 'Edge Detect 2',
    factor: 1,
    bias: 0,
    filter: [
      [ -1, -1, -1 ],
      [ -1, 8, -1 ],
      [ -1, -1, -1 ],
    ]
  },

  edgedetect3: {
    name: 'Edge Detect 3',
    factor: 1,
    bias: 0,
    filter: [
      [ 1, 1, 1 ],
      [ 1, -7, 1 ],
      [ 1, 1, 1 ],
    ]
  },

  emboss: {
    name: 'Emboss',
    factor: 1,
    bias: 0,
    filter: [
      [ -2, -1, 0 ],
      [ -1, 1, 1 ],
      [ 0, 1, 2 ],
    ]
  },

  unsharpen: {
    name: 'Unsharpen (without mask)',
    factor: -1/256,
    bias: 0,
    filter: [
      [1, 4, 6, 4, 1],
      [4, 16, 24, 16, 4],
      [6, 24, -476, 24, 6],
      [4, 16, 24, 16, 4],
      [1, 4, 6, 4, 1]
    ]
  },

  laplacianOfGaussian5X5: {
    name: 'Laplacian of Gaussian 5 X 5',
    factor: 1,
    bias: 0,
    filter: [
      [  0, 0, -1, 0, 0 ],
      [  0, -1, -2, -1, 0 ],
      [ -1, -2, 16, -2, -1 ],
      [  0, -1, -2, -1, 0 ],
      [  0, 0, -1, 0, 0 ]
    ]
  },

  laplacianOfGaussia9X9: {
    name: 'Laplacian of Gaussian 9 X 9',
    factor: 1,
    bias: 0,
    filter: [
      [ 0, 1, 1, 2, 2, 2, 1, 1, 0 ],
      [ 1, 2, 4, 5, 5, 5, 5, 2, 1 ],
      [ 1, 4, 5, 3, 0, 3, 5, 4, 1 ],
      [ 2, 5, 3, -12, -24, -12, 3, 5, 2],
      [ 2, 5, 0, -24, -40, -24, 0, 5, 2 ],
      [ 2, 5, 3, -12, -24, -12, 3, 5, 2],
      [ 1, 4, 5, 3, 0, 3, 5, 4, 1 ],
      [ 1, 2, 4, 5, 5, 5, 5, 2, 1 ],
      [ 0, 1, 1, 2, 2, 2, 1, 1, 0 ]
    ]
  }
};
