/* global FileReader, fetch */

const utils = { // eslint-disable-line no-unused-vars
  googleFontEncode: async (url) => {
    return new Promise(async (resolve, reject) => {
      let googleRes = false
      try {
        googleRes = await fetch(url)
      } catch (e) {
        resolve(false)
        return
      }
      let googleCssStyles = await googleRes.text()
      let link = googleCssStyles.match(/https:\/\/[^)]+/g)[0]
      let fontRaw = await fetch(link)
      let fontBuffer = await fontRaw.blob()
      var reader = new FileReader()
      reader.addEventListener('load', function () {
        resolve(googleCssStyles.replace(link, this.result))
      })
      reader.readAsDataURL(fontBuffer)
    })
  },

  createSvgElem: async (elem, attributes = false, styles = false, appendTarget) => {
    let svgElem = document.createElementNS('http://www.w3.org/2000/svg', elem)
    if (styles) {
      Object.assign(svgElem.style, styles)
    }
    if (attributes && attributes.length) {
      attributes.forEach(async (attr) => {
        svgElem.setAttribute(attr[0], attr[1])
      })
    }
    if (appendTarget) {
      appendTarget.appendChild(svgElem)
    }
    return svgElem
  },

  sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },

  asyncForEach: async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  },

  saveBadge () {
    let done = document.createElement('div')
    done.id = 'done'
    document.body.appendChild(done)
  }
}
