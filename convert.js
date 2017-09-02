function multiply (a, b) {
  const aNumRows = a.length, aNumCols = a[0].length,
    bNumCols = b[0].length,
    m = new Array(aNumRows)
  for (var r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols)
    for (var c = 0; c < bNumCols; ++c) {
      m[r][c] = 0
      for (var i = 0; i < aNumCols; ++i) {
        m[r][c] += a[r][i] * b[i][c]
      }
    }
  }
  return m
}

function transpose (array) {
  var newArray = [],
    origArrayLength = array.length,
    arrayLength = array[0].length,
    i
  for (i = 0; i < arrayLength; i++) {
    newArray.push([])
  }

  for (i = 0; i < origArrayLength; i++) {
    for (var j = 0; j < arrayLength; j++) {
      newArray[j].push(array[i][j])
    }
  }
  return newArray
}

function rgbToXyz (rgb) {
  const rgbt = transpose([rgb])
  const rtx = [[0.49, 0.31, 0.2], [0.17697, 0.81240, 0.010630], [0, 0.01, 0.99]]
  const xyz = multiply(rtx, rgbt)
  const xyz2 = multiply(xyz, [[1 / 0.17697]])
  const xyz2t = transpose(xyz2)[0]
  return xyz2t
}

function xyzToRgb (xyz) {
  const xyzt = transpose([xyz])
  const xtr = [[0.41847, -0.15866, -0.082835], [-0.091169, 0.25243, 0.015708], [0.00092090, -0.0025498, 0.17860]]
  const rgb = multiply(xtr, xyzt)
  return clamp(rgb)
}

function labf (t) {
  const sigma2 = Math.pow(6 / 29, 2)
  const sigma3 = Math.pow(6 / 29, 3)
  return t > sigma3
    ? Math.pow(t, 1 / 3)
    : t / (3 * sigma2 + 4 / 29)
}

function labf1 (t) {
  const sigma = 6 / 29
  const sigma2 = Math.pow(sigma, 2)
  return t > sigma
    ? Math.pow(t, 3)
    : 3 * sigma2 * (t - 4 / 29)
}
const LabWhitepoint = {xn: 95.047, yn: 100, zn: 108.883}

function xyzToLab (xyz) {
  const xyzt = transpose([xyz])
  const x = xyz[0] / LabWhitepoint.xn
  const y = xyz[1] / LabWhitepoint.yn
  const z = xyz[2] / LabWhitepoint.zn
  const L = 116 * labf(y) - 16
  const a = 500 * (labf(x) - labf(y))
  const b = 200 * (labf(y) - labf(z))
  return [L, a, b]
}

function labToXyz (lab) {
  const L = lab[0], a = lab[1], b = lab[2]
  const x = LabWhitepoint.xn * labf1((L + 16) / 116 + a / 500)
  const y = LabWhitepoint.yn * labf1((L + 16) / 116)
  const z = LabWhitepoint.zn * labf1((L + 16) / 116 - b / 200)
  return [x, y, z]
}

function labToLch (lab) {
  const L = lab[0], a = lab[1], b = lab[2]
  const C = Math.sqrt(a * a + b * b)
  const h = a !== 0 ? Math.atan(b / a) : 0
  return [L, C, h]
}

function lchToLab (lab) {
  const L = lab[0], c = lab[1], h = lab[2]
  const a = c * Math.cos(h)
  const b = c * Math.sin(h)
  return [L, a, b]
}

function xyzToLch (xyz) {
  const lab = xyzToLab(xyz)
  return labToLch(lab)
}

function rgbToLab (rgb) {
  const xyz = rgbToXyz(rgb)
  return xyzToLab(xyz)
}

function rgbToLch (rgb) {
  const xyz = rgbToXyz(rgb)
  return xyzToLch(xyz)
}

function labToRgb (lab) {
  const xyz = labToXyz(lab)
  return xyzToRgb(xyz)
}

function lchToRgb (lch) {
  const lab = lchToLab(lch)
  return labToRgb(lab)
}

// Clamp to integer range 0-255
function clampFloat (f) {
  return Math.round(Math.max(0, Math.min(255, f)))
}

// Clamp array to integer range 0-255
function clamp (rgb) {
  return [
    clampFloat(rgb[0][0]),
    clampFloat(rgb[1][0]),
    clampFloat(rgb[2][0])]
}

export { multiply, rgbToXyz, rgbToLab, rgbToLch, labToRgb, lchToRgb, xyzToRgb}
