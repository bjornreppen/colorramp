function rgbToXyz (rgb) {
  let R = rgb.r / 255
  let G = rgb.g / 255
  let B = rgb.b / 255
  if (R > 0.04045) R = Math.pow((R + 0.055) / 1.055, 2.4)
  else R = R / 12.92
  if (G > 0.04045) G = Math.pow((G + 0.055) / 1.055, 2.4)
  else G = G / 12.92
  if (B > 0.04045) B = Math.pow((B + 0.055) / 1.055, 2.4)
  else B = B / 12.92

  R *= 100
  G *= 100
  B *= 100

  const y = R * 0.2126 + G * 0.7152 + B * 0.0722
  const x = R * 0.4124 + G * 0.3576 + B * 0.1805
  const z = R * 0.0193 + G * 0.1192 + B * 0.9505
  return {x, y, z}
}

function xyzToRgb (xyz) {
// X, Y and Z input refer to a D65/2° standard illuminant.
// sR, sG and sB (standard RGB) output range = 0 ÷ 255
  let X = xyz.x / 100
  let Y = xyz.y / 100
  let Z = xyz.z / 100

  let R = X * 3.2406 + Y * -1.5372 + Z * -0.4986
  let G = X * -0.9689 + Y * 1.8758 + Z * 0.0415
  let B = X * 0.0557 + Y * -0.2040 + Z * 1.0570

  if (R > 0.0031308) R = 1.055 * Math.pow(R, 1 / 2.4) - 0.055
  else R = 12.92 * R
  if (G > 0.0031308) G = 1.055 * Math.pow(G, 1 / 2.4) - 0.055
  else G = 12.92 * G
  if (B > 0.0031308) B = 1.055 * Math.pow(B, 1 / 2.4) - 0.055
  else B = 12.92 * B

  return {
    r: clamp2Byte(R * 255),
    g: clamp2Byte(G * 255),
    b: clamp2Byte(B * 255)
  }
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
  const x = xyz.x / LabWhitepoint.xn
  const y = xyz.y / LabWhitepoint.yn
  const z = xyz.z / LabWhitepoint.zn
  const L = 116 * labf(y) - 16
  const a = 500 * (labf(x) - labf(y))
  const b = 200 * (labf(y) - labf(z))
  return {L, a, b}
}

function labToXyz (lab) {
  const L = lab.L
  const a = lab.a
  const b = lab.b
  const x = LabWhitepoint.xn * labf1((L + 16) / 116 + a / 500)
  const y = LabWhitepoint.yn * labf1((L + 16) / 116)
  const z = LabWhitepoint.zn * labf1((L + 16) / 116 - b / 200)
  return {x, y, z}
}

function labToLch (lab) {
  const L = lab.L
  const a = lab.a
  const b = lab.b
  const C = Math.sqrt(a * a + b * b)
  let h = Math.atan2(b, a)
  if (h > 0) h = (h / Math.PI) * 180
  else h = 360 - (Math.abs(h) / Math.PI) * 180

  return {L, C, h}
}

function lchToLab (lab) {
  const L = lab.L
  const C = lab.C
  const h = lab.h / 180 * Math.PI
  const a = C * Math.cos(h)
  const b = C * Math.sin(h)
  return {L, a, b}
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
 // console.log('xyz', xyz)
  return xyzToRgb(xyz)
}

function lchToRgb (lch) {
  const lab = lchToLab(lch)
//  console.log('lab', lab)
  return labToRgb(lab)
}

// Clamp to byte range 0-255
function clamp2Byte (f) {
  return Math.round(Math.max(0, Math.min(255, f)))
}

function hexToRgb (hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b
  })

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

export { hexToRgb, rgbToXyz, rgbToLab, rgbToLch, labToRgb, lchToRgb, xyzToRgb}
