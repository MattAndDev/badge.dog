/* global SVG, utils, query */

(async () => {
  let defaults = {
    title: 'badge.dog',
    shieldTitle: 'HTML',
    shieldTitleSize: 50,
    shieldTitleColor: '#333',
    shieldBg: '#E34C26',
    shieldShadow: '#F06529',
    shieldCharacter: 'five',
    googleFontName: 'Montserrat'
  }

  let config = (typeof query !== 'undefined') ? {...defaults, ...query} : defaults

  const svg = SVG('badge')
  svg.element('title').words(config.title)
  let defs = svg.defs()

  let css = await utils.googleFontEncode(`https://fonts.googleapis.com/css?family=${config.googleFontName}&text=?text=${config.shieldTitle}%20${config.shieldCharacter}`)
  defs.node.innerHTML = `
    <style type="text/css">
      ${css}
    </style>
    `

  let getCorrectFontSize = async (text, {width, height}, size) => {
    let placeholder = svg.text((add) => {
      text.forEach((chunk) => {
        add.tspan(chunk).newLine()
      })
    })
    placeholder.font({
      family: config.googleFontName,
      size,
      weight: '900',
      'alignment-baseline': 'baseline',
      'text-anchor': 'middle',
      fill: config.shieldTitleColor
    })
      .move(50, 0)
    await utils.sleep(5)
    let box = placeholder.node.getBBox()
    if (box.width > width || box.height > height) {
      if (box.height * 2 < height && text.length === 1) {
        placeholder.remove()
        return getCorrectFontSize(text[0].split(' '), {width: 100, height: 40}, size)
      }
      placeholder.remove()
      return getCorrectFontSize(text, {width: 100, height: 40}, size - 1)
    }
    if (box.height < height * 1.5) {
      placeholder.move(50, 40 - box.height)
    }
    return false
  }

  let text = decodeURIComponent(config.shieldTitle).split('\n')
  await getCorrectFontSize(text, {width: 100, height: 40}, parseInt(config.shieldTitleSize))

  let shieldPath = 'M0 0 L100 0 L95 100 L50 120 L5 100 Z'
  svg.path(shieldPath).fill(config.shieldBg).move(0, 40)
  let shieldShadow = 'M90 10 L 50 10 L 50 110 L87 94'
  svg.path(shieldShadow).fill(config.shieldShadow).move(50, 50)

  svg.size(100, 160)

  let shieldContentPaths = {
    three: 'M20 30 L75 30 L73 58 L21.5 58  L73 58 L71.9 81 L50 90 L29 81 L28.1 70',
    five: 'M80 30 L26 30 L27 58 L73 58 L72 81 L50 90 L29 81 L28.1 70',
    eight: 'M20 30 L26 30 L27.6 58 L72.5 58 L74 30 L50 30 L 26 30 L29 81 L50 90 L71.8 80 L74 30'
  }

  svg.path(shieldContentPaths[config.shieldCharacter])
    .stroke({ width: 12, color: '#FFF' })
    .fill('none')
    .y(70)
  await utils.sleep(5)
  let done = document.createElement('div')
  done.id = 'done'
  document.body.appendChild(done)
})()
