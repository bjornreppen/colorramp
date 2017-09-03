import { rgbToLch, lchToRgb } from './convert'

function slerpLinear (start, end, fraction) {
  return start * (1 - fraction) + end * fraction
}
function slerpPolar (start, end, fraction) {
  let distance = end - start
//  if (distance > Math.PI) distance -= Math.PI
//  if (distance < -Math.PI) distance += Math.PI
  return start + distance * fraction
}

function slerp (start, end, fraction) {
  let r = {
    L: slerpLinear(start.L, end.L, fraction),
    C: slerpLinear(start.C, end.C, fraction),
    h: slerpPolar(start.h, end.h, fraction)
  }
  return r
}

// RGB values as int (0-255) array [r,g,b]
function buildRamp (startRgb, endRgb, steps = 256) {
  const l1 = rgbToLch(startRgb)
  const l2 = rgbToLch(endRgb)
  let ramp = []
 // console.log(startRgb, endRgb)
//  console.log(l1, l2)
  for (var step = 0; step < steps; step++) {
    const li = slerp(l1, l2, step / (steps - 1))
//    console.log(step, step / (steps - 1), li)
  //  console.log(lchToRgb(li))
    ramp[step] = lchToRgb(li)
  }
  return ramp
}

export {slerp, buildRamp}
