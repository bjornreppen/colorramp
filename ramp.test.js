import {slerp, buildRamp} from './ramp'

const red = [255, 0, 0]
const blue = [0, 0, 255]

test('build ramp', () => {
  const c1 = [253, 231, 37]
  const c2 = [68, 1, 84]
  const actual = buildRamp(c1, c2, 2)
  console.log(actual)
})
test('slerp 0', () => {
  const actual = slerp(red, blue, 0)
  expect(actual).toMatchSnapshot()
})

test('slerp 50', () => {
  const actual = slerp(red, blue, 0.5)
  expect(actual).toMatchSnapshot()
})

test('slerp 100', () => {
  const actual = slerp(red, blue, 1)
  expect(actual).toMatchSnapshot()
})

test('grayscale ramp', () => {
  const black = [0, 0, 0]
  const white = [255, 255, 255]
  const actual = buildRamp(black, white)
  expect(actual).toMatchSnapshot()
})

function toArgb (arr) {
  return `rgb(${arr[0]}, ${arr[1]}, ${arr[2]})`
}

test('grayscale ramp html', () => {
  const black = [0, 0, 0]
  const white = [255, 255, 255]
  const ramp = buildRamp(black, white)
  console.log('<h2>Grayscale</h2>' + ramp2html(ramp))
  expect(ramp).toMatchSnapshot()
})

test('ramp viridis', () => {
  const c1 = [253, 231, 37]
  const c2 = [68, 1, 84]
  const ramp = buildRamp(c1, c2)
  console.log('<h2>Viridis</h2>' + ramp2html(ramp))
  expect(ramp).toMatchSnapshot()
})

function ramp2html (ramp) {
  const arr = ramp.map(x => `<div style="display: inline; float: left; width: 5px; height: 30px; background-color: ${toArgb(x)}"></div>`)
  return arr.join('')
}
