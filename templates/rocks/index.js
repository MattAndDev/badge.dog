/* global utils, query */
(async () => {
  let defaults = {
    title: 'badge.dog',
    shieldTitle: 'HTML',
    shieldTitleSize: 50,
    shieldTitleColor: '#333',
    shieldBg: '#E34C26',
    shieldShadow: '#F06529',
    shieldCharacter: 'five',
    shieldCharacterColor: '#FFF',
    googleFontName: 'Roboto'
  }

  let config = (typeof query !== 'undefined') ? { ...defaults, ...query } : defaults
  // container
  // container
  const svg = await utils.createSvgElem(
    'svg',
    [
      ['xmlns', 'http://www.w3.org/2000/svg'],
      ['xmlns:xlink', 'http://www.w3.org/1999/xlink']
    ]
  )
  document.getElementById('badge').appendChild(svg)
  const shieldSize = { width: 100, height: 160 }

  // title
  let title = await utils.createSvgElem('title', false, false, svg)
  title.innerHTML = config.title
  svg.appendChild(title)

  // custom font
  let defs = await utils.createSvgElem('defs')
  let css = await utils.googleFontEncode(`https://fonts.googleapis.com/css?family=${config.googleFontName}&text=${config.shieldTitle}`)
  if (css) {
    defs.innerHTML = `
    <style type='text/css'>
    ${css}
    </style>
    `
    svg.appendChild(defs)
  }

  let splitTextToFit = async (textToSplit, { width, height }, fontSize) => {
    let text = await utils.createSvgElem(
      'text', [['y', 0]],
      {
        fontFamily: config.googleFontName,
        fill: config.shieldTitleColor,
        fontSize: fontSize,
        fontWeight: 900,
        dominantBaseline: 'hanging',
        alignmentBaseline: 'baseline',
        textAnchor: 'middle',
        transform: 'translate(0, 5px)'
      },
      svg
    )
    textToSplit.forEach(async (chunk, i) => {
      if (!chunk.length) return
      let tspan = await utils.createSvgElem(
        'tspan',
        [
          ['y', i * fontSize],
          ['x', shieldSize.width / 2]
        ],
        { textAnchor: 'middle' },
        text
      )
      tspan.innerHTML = chunk
    })
    await utils.sleep(10)
    let box = text.getBBox()
    text.setAttribute('x', shieldSize.width / 2)
    if (box.width > width || box.height > height) {
      if (box.height * 2 < height && textToSplit.length === 1) {
        text.remove()
        return splitTextToFit(textToSplit[0].split(' '), { width: 100, height: 40 }, fontSize)
      }
      text.remove()
      return splitTextToFit(textToSplit, { width: 100, height: 40 }, fontSize - 1)
    }
    await utils.sleep(5)
    return box.height + (textToSplit.length - 1) * 2
  }

  let text = decodeURIComponent(config.shieldTitle).split('\n')
  let textHeight = await splitTextToFit(text, { width: 100, height: 40 }, parseInt(config.shieldTitleSize))
  let shieldPath = 'M0 0 L100 0 L95 100 L50 120 L5 100 Z'
  await utils.createSvgElem(
    'path',
    [['d', shieldPath]],
    { fill: config.shieldBg, transform: `translate(0, ${textHeight}px)` },
    svg
  )
  let shieldShadow = 'M90 10 L 50 10 L 50 110 L87 94'
  await utils.createSvgElem(
    'path',
    [['d', shieldShadow]],
    { fill: config.shieldShadow, transform: `translate(0, ${textHeight}px)` },
    svg
  )
  let shieldContentPaths = {
    three: 'M20 30 L75 30 L73 58 L21.5 58  L73 58 L71.9 81 L50 90 L29 81 L28.1 70',
    five: 'M80 30 L26 30 L27 58 L73 58 L72 81 L50 90 L29 81 L28.1 70',
    eight: 'M20 30 L26 30 L27.6 58 L72.5 58 L74 30 L50 30 L 26 30 L29 81 L50 90 L71.8 80 L74 30'
  }
  if (!shieldContentPaths[config.shieldCharacter]) {
    // await utils.error(Message)
    return false
  }
  await utils.createSvgElem(
    'path',
    [['d', shieldContentPaths[config.shieldCharacter]]],
    {
      strokeWidth: 12,
      stroke: config.shieldCharacterColor,
      fill: 'none',
      transform: `translate(0, ${textHeight}px)`
    },
    svg
  )
  svg.setAttribute('width', shieldSize.width)
  svg.setAttribute('height', textHeight + 120)
  utils.saveBadge()
})()
