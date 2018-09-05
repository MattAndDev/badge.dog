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
  const config = (typeof query !== 'undefined') ? {...defaults, ...query} : defaults

  // cast opts
  config.paddingVer = parseInt(config.paddingVer)
  config.paddingHor = parseInt(config.paddingHor)

  const svg = createSvgElem('svg')
  document.getElementById('badge').appendChild(svg)

  let title = createSvgElem('title')
  title.innerHTML = config.title
  svg.appendChild(title)
  let defs = createSvgElem('defs')
  let css = await utils.googleFontEncode(`https://fonts.googleapis.com/css?family=${config.googleFontName}&text=${config.leftText}%20${config.rightText}`)
  defs.innerHTML = `
    <style type='text/css'>
      ${css}
    </style>
    `
  svg.appendChild(defs)
  let blocks = ['left', 'right']
  let offset = 0

  blocks.forEach(async (block, i) => {
    let text = createSvgElem('text')
    svg.appendChild(text)
    text.innerHTML = config[`${block}Text`]
    text.setAttribute('y', 0)
    Object.assign(text.style, {
      fontFamily: config.googleFontName,
      fill: config[`${block}TextColor`],
      fontSize: config.fontSize,
      dominantBaseline: 'hanging'
    })

    await utils.sleep(10)

    text.setAttribute('y', config.paddingVer / 2 + 2)
    text.setAttribute('x', offset + config.paddingHor / 2)
    let bg = createSvgElem('rect')
    Object.assign(bg.style, {
      fill: config[`${block}BgColor`],
      width: text.getBBox().width + config.paddingHor,
      height: text.getBBox().height + config.paddingVer
    })

    bg.setAttribute('x', offset)
    svg.insertBefore(bg, text)
    offset = offset + parseInt(bg.style.width)
    if (i === blocks.length - 1) {
      svg.setAttribute('width', offset)
      svg.setAttribute('height', text.getBBox().height + config.paddingVer)
      utils.saveBadge()
    }
  })
})()
