'use strict'

/**
 * Check for string type
 * @param {Object} o - object to type check
 * @param {String} paramName - parameter name being checked
 * @throws {TypeError} - if o is not a string
 */
const stringCheck = (o, paramName) => {
  if (typeof o !== 'string') {
    throw new TypeError(`Expected ${paramName} to be a string`)
  }
}

/**
 * Check for empty string
 * @param {String} str - string to check if not empty
 * @param {String} paramName - parameter name being checked
 * @throws {Error} - if str is an empty string
 */
const emptyStringCheck = (str, paramName) => {
  if (str.length === 0) {
    throw new Error(`Expected ${paramName} to be non-empty string`)
  }
}

/**
 * Check for whitespace
 * @param {String} str - string to check for whitespace
 * @param {String} paramName - parameter name being checked
 * @throws {Error} - if str contains whitespace
 */
const whitespaceCheck = (str, paramName) => {
  if (str.match(/\s/g)) {
    throw new Error(`Expected ${paramName} to not contain whitespace`)
  }
}

/**
 * Get functionName's params in contents
 * @param {String} contents - string to search for function info
 * @param {String} functionName - function name to get params of
 * @param {Object} opts - passed options
 * @param {String} opts.language - language file of file being used ('js', 'coffee', 'ts')
 * @param {String} [opts.regex] - custom regex that must have a group matcher
 * @param {Boolean} [opts.type] - should parameter types be returned (used only for TypeScript)
 * @returns {Array} - list of params
 */
module.exports = function (contents, functionName, opts = {}) {
  let regex

  if (opts.language && opts.language !== 'js' && opts.language !== 'coffee' && opts.language !== 'ts') {
    throw new Error('Expected opts.language to be \'js\', \'coffee\', or \'ts\'')
  }

  stringCheck(contents, 'contents')
  emptyStringCheck(contents, 'contents')

  stringCheck(functionName, 'functionName')
  emptyStringCheck(functionName, 'functionName')
  whitespaceCheck(functionName, 'functionName')

  if (contents.indexOf(functionName) === -1) {
    throw new Error(`Expected function ${functionName} to be in fileContents`)
  }

  if (!opts.regex) {
    if (opts.language === 'coffee') {
      regex = new RegExp(`${functionName}[\\s]*=[\\s]*\\(([\\s\\S]*?)\\)`)
    } else {
      regex = new RegExp(`function ${functionName}[\\s]*\\(([\\s\\S]*?)\\)`)
    }
  } else {
    regex = new RegExp(opts.regex)
  }

  const matches = regex.exec(contents)

  if (!matches) {
    return []
  }

  return matches[1].split(',')
    .filter(param => param !== '')
    .map(param => {
      const typeLocation = param.indexOf(':')

      let formattedParam = param
        , type = null

      if (opts.language !== 'ts') {
        return formattedParam.trim()
      }

      if (opts.type && typeLocation !== -1) {
        type = formattedParam.substring(typeLocation + 1, formattedParam.length)
        type = type.trim()
      }

      if (typeLocation !== -1) {
        formattedParam = formattedParam.substring(0, typeLocation)
      }

      formattedParam = formattedParam.trim()

      if (opts.type) {
        return {
          param: formattedParam,
          type
        }
      }

      return formattedParam
    })
}
