import translate from 'counterpart'
import fs from 'fs'
import path from 'path'
import moment from 'moment'

const DEFAULT_LANGUAGE = 'en'

// ----------------------------------------------------------------------------
// counterpart helper functions
// t and l functions surrounding translate and translate.loacalize functions
export function t(args) {
  return translate.apply(this, arguments)
}

export function l(args) {
  return translate.localize(arguments[0], arguments[1])
}

export function changeLanguage(language) {
  const lang = {
    counterpart: {
      // názvy měsíců a dní a jejich zkratky
      names: require('../../locales/' + language + '/' + language + '.dates.json').names,
      // definuje, který klíč vzít pro různý počet. Tento en rozhoduje zda vzít zero, one nebo other key.
      // vlastním plurarizerem je možné nadefinovat kdy používat i další klíče (např. jeden, dva, tri a vice - pro pripady kdy se tvary těchto počtů liší).
      pluralize: require('../../locales/' + language + '/' + language + '.pluralize.js'),
      // formáty datumů - používá strftime
      // Dokumentace k strftime - https://github.com/samsonjs/strftime#supported-specifiers
      formats: require('../../locales/' + language + '/' + language + '.dates.json').formats
    }
  }

  translate.registerTranslations(language, lang)
  translate.registerTranslations(language, require('../../locales/' + language + '/' + language + '.json'))

  translate.setLocale(language)
  moment.locale(language)
}

export function getLanguage() {
  return translate.getLocale()
}

// This function copies structure and content of default language ('en')
export function create(dest, lang) {
  if (!fs.existsSync(path.join(dest, lang))) {
    fs.mkdirSync(path.join(dest, lang))
    copyFile(path.join(dest, DEFAULT_LANGUAGE, DEFAULT_LANGUAGE + '.dates.json'), path.join(dest, lang, lang + '.dates.json'))
    copyFile(path.join(dest, DEFAULT_LANGUAGE, DEFAULT_LANGUAGE + '.json'), path.join(dest, lang, lang + '.json'))
    copyFile(path.join(dest, DEFAULT_LANGUAGE, DEFAULT_LANGUAGE + '.pluralize.js'), path.join(dest, lang, lang + '.pluralize.js'))
  } else {
    throw 'Language "' + lang + '" already has structure created.'
  }
}


// ----------------------------------------------------------------------------
// Private functions

function copyFile(from, to) {
  const content = fs.readFileSync(from, 'utf8')
  fs.writeFile(to, content, err => console.log(err))
}
