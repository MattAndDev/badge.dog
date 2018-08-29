/** @module services/hash */

/**
*  render html file with puppeteer and returns dom as string
*  optionally
*
*  @func fromStr
*  @param {String} str - string to be converted to hash
*  @returns {Integer} hash as integer for the given string
*/

// @TODO: needs to be tested see https://github.com/MattAndDev/badge.dog/issues/7

const fromString = async (str) => {
  let hash = 5381
  let length = str.length
  while (length) {
    hash = (hash * 33) ^ str.charCodeAt(--length)
  }
  return hash >>> 0
}

module.exports = {
  fromString
}
