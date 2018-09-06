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
        resolve([googleCssStyles, this.result])
      })
      reader.readAsDataURL(fontBuffer)
    })
  },
  sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },
  saveBadge () {
    let done = document.createElement('div')
    done.id = 'done'
    document.body.appendChild(done)
  }
}
