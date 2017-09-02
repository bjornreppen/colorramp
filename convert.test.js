import {multiply, rgbToXyz, rgbToLab, rgbToLch, labToRgb, lchToRgb, xyzToRgb} from './convert'

test('matrix multiply', () => {
  const expected = [[5], [11]]
  const actual = multiply([[1, 2], [3, 4]], [[1], [2]])
  expect(actual).toEqual(expected)
})

test('#FDE725 to xyz', () => {
  const actual = rgbToXyz([253, 231, 37])
  expect(actual).toEqual(
    [
      69.41785558045027,
      78.1680461121995,
      13.179494122477161
    ])
})

test('#4080ff to xyz', () => {
  const actual = rgbToXyz([64, 128, 255])
  expect(actual).toMatchSnapshot()
})

test('#ffffff to xyz', () => {
  const actual = rgbToXyz([1, 1, 1])
  expect(actual).toMatchSnapshot()
})

test('#8040ff to lab', () => {
  const actual = rgbToLab([128, 64, 255])
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

test('roundtrip xyz black', () => {
  const xyz = rgbToXyz([0, 0, 0])
  const actual = xyzToRgb(xyz)
  expect(actual).toMatchSnapshot()
})

test('roundtrip xyz white', () => {
  const xyz = rgbToXyz([255, 255, 255])
  const actual = xyzToRgb(xyz)
  expect(actual).toMatchSnapshot()
})

test('roundtrip xyz random', () => {
  const expected = [192, 130, 27]
  const xyz = rgbToXyz(expected)
  const actual = xyzToRgb(xyz)
  expect(actual).toMatchSnapshot()
})

test('roundtrip lab black', () => {
  const expected = [0, 0, 0]
  expect(roundtripRgbLab(expected)).toEqual(expected)
})

test('roundtrip lab white', () => {
  const expected = [255, 255, 255]
  expect(roundtripRgbLab(expected)).toEqual(expected)
})

test('roundtrip lab #a08040', () => {
  const expected = [192, 128, 64]
  expect(roundtripRgbLab(expected)).toEqual(expected)
})

test('roundtrip lch #ff00ff', () => {
  const expected = [255, 0, 255]
  expect(roundtripRgbLch(expected)).toEqual(expected)
})

test('roundtrip lch #ff8040', () => {
  const expected = [255, 128, 64]
  expect(roundtripRgbLch(expected)).toEqual(expected)
})

test('roundtrip lch random', () => {
  const expected = [192, 130, 27]
  expect(roundtripRgbLch(expected)).toEqual(expected)
})

test('roundtrip xyz viridis', () => {
  const expected = [253, 231, 37]
  expect(roundtripRgbXyz(expected)).toEqual(expected)
})

test('roundtrip lab viridis', () => {
  const expected = [253, 231, 37]
  expect(roundtripRgbLab(expected)).toEqual(expected)
})

test('roundtrip lch viridis', () => {
  const expected = [253, 231, 37]
  expect(roundtripRgbLch(expected)).toEqual(expected)
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
