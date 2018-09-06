/* global  utils, query */
(async () => {
  let defaults = {
    title: 'badge.dog',
    leftText: 'BADGE',
    leftBgColor: '#20A69A',
    leftTextColor: '#FFF',
    rightText: 'DOG',
    rightBgColor: '#043B40',
    rightTextColor: '#FFF',
    paddingVer: 16,
    paddingHor: 16,
    fontSize: 14,
    googleFontName: 'Lato'
  }

  const createSvgElem = (elem) => document.createElementNS('http://www.w3.org/2000/svg', elem)
  const config = (typeof query !== 'undefined') ? { ...defaults, ...query } : defaults

  // cast opts
  config.paddingVer = parseInt(config.paddingVer)
  config.paddingHor = parseInt(config.paddingHor)

  // container
  const svg = await utils.createSvgElem(
    'svg',
    [
      ['xmlns', 'http://www.w3.org/2000/svg'],
      ['xmlns:xlink', 'http://www.w3.org/1999/xlink']
    ]
  )

  document.getElementById('badge').appendChild(svg)

  // title
  let title = createSvgElem('title')
  title.innerHTML = config.title
  svg.appendChild(title)

  // custom font
  let defs = createSvgElem('defs')
  let css = await utils.googleFontEncode(`https://fonts.googleapis.com/css?family=${config.googleFontName}&text=${config.leftText}%20${config.rightText}`)
  if (css) {
    defs.innerHTML = `
    <style type='text/css'>
    ${css}
    </style>
    `
    svg.appendChild(defs)
  }

  let blocks = ['left', 'right']
  let offset = 0

  utils.asyncForEach(blocks, async (block, i) => {
    // text
    let text = await utils.createSvgElem(
      'text', [
        ['x', offset + config.paddingHor / 2],
        ['y', config.paddingVer / 2 + 2]
      ],
      {
        fontFamily: config.googleFontName,
        fill: config[`${block}TextColor`],
        fontSize: config.fontSize,
        dominantBaseline: 'hanging'
      },
      svg
    )
    text.innerHTML = config[`${block}Text`]

    // background
    let bg = await utils.createSvgElem(
      'rect',
      [['x', offset]],
      {
        fill: config[`${block}BgColor`],
        width: text.getBBox().width + config.paddingHor,
        height: text.getBBox().height + config.paddingVer
      }
    )
    svg.insertBefore(bg, text)

    // increment offset
    offset = offset + parseInt(bg.style.width)

    if (i === blocks.length - 1) {
      // set svg size and save
      svg.setAttribute('width', offset)
      svg.setAttribute('height', text.getBBox().height + config.paddingVer)
      utils.saveBadge()
    }
  })
})()
