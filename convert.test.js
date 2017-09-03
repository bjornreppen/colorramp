import {hexToRgb, rgbToXyz, rgbToLab, rgbToLch, labToRgb, lchToRgb, xyzToRgb} from './convert'

const viridis1 = hexToRgb('#440154')

test('#FDE725 to xyz', () => {
  const actual = rgbToXyz(hexToRgb('#FDE725'))
  expect(actual).toEqual(
    {
      x: 69.41785558045027,
      y: 78.1680461121995,
      z: 13.179494122477161
    })
})

test('#8040ff to lab', () => {
  const actual = rgbToLab(hexToRgb('#8040FF'))
  expect(actual).toMatchSnapshot()
})

test('#1030a0 to lch', () => {
  const actual = rgbToLch([16, 48, 160])
  expect(actual).toMatchSnapshot()
})

test('xyz to rgb', () => {
  const xyz = [80, 150, 220]
  const actual = xyzToRgb(xyz)
  expect(actual).toMatchSnapshot()
})

test('roundtrip xyz random', () => {
  const xyz = rgbToXyz(viridis1)
  const actual = xyzToRgb(xyz)
  expect(actual).toMatchSnapshot()
})

test('roundtrip lab white', () => {
  expect(roundtripRgbLab(hexToRgb('#ffffff'))).toMatchSnapshot()
})

test('roundtrip lch #ff8040', () => {
  expect(roundtripRgbLch(hexToRgb('#ff8040'))).toMatchSnapshot()
})

test('roundtrip xyz viridis', () => {
  expect(roundtripRgbXyz(viridis1)).toMatchSnapshot()
})

test('roundtrip lab viridis', () => {
  expect(roundtripRgbLab(viridis1)).toMatchSnapshot()
})

test('roundtrip lch viridis', () => {
  expect(roundtripRgbLch(viridis1)).toMatchSnapshot()
})

function roundtripRgbXyz (rgb) {
  const lab = rgbToXyz(rgb)
  return xyzToRgb(lab)
}

function roundtripRgbLab (rgb) {
  const lab = rgbToLab(rgb)
  return labToRgb(lab)
}

function roundtripRgbLch (rgb) {
  const lch = rgbToLch(rgb)
  return lchToRgb(lch)
}
