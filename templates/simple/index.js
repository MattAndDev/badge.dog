/* global SVG, utils, query */
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

  let config = (typeof query !== 'undefined') ? {...defaults, ...query} : defaults
  // cast opts
  config.paddingVer = parseInt(config.paddingVer)
  config.paddingHor = parseInt(config.paddingHor)
  var svg = SVG('badge')
  svg.element('title').words(config.title)
  let defs = svg.defs()
  let css = await utils.googleFontEncode(`https://fonts.googleapis.com/css?family=${config.googleFontName}&text=${config.leftText}%20${config.rightText}`)
  defs.node.innerHTML = `
    <style type="text/css">
      ${css}
    </style>
    `

  let blocks = ['left', 'right']
  let offset = 0
  blocks.forEach(async (block, i) => {
    let sizer = svg.text(config[`${block}Text`])
    sizer
      .move(0, 0)
      .font({family: config.googleFontName, size: config.fontSize})

    // wait for render
    await utils.sleep(50)

    let bgSize = [sizer.node.getBBox().width + config.paddingHor, sizer.node.getBBox().height + config.paddingVer]
    let bg = svg.rect(...bgSize)
    bg
      .fill(config[`${block}BgColor`])
      .move(0, 0)
      .x(offset)

    let text = svg.text(config[`${block}Text`])
    text
      .fill(config[`${block}TextColor`])
      .move(0, 0)
      .font({family: config.googleFontName, size: config.fontSize})
      .y(config.paddingVer / 2)
      .x(offset + config.paddingHor / 2)

    sizer.node.remove()

    offset = offset + bgSize[0]

    if (i === blocks.length - 1) {
      svg.size(offset)
      let done = document.createElement('div')
      done.id = 'done'
      document.body.appendChild(done)
    }
  })
})()
