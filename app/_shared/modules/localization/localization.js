import translate from 'counterpart'
import fs from 'fs'
import path from 'path'
import Papa from './papaparse.min'

const DEFAULT_LANGUAGE = 'en'
const LANGUAGES_FILE_NAME = "languages.csv"

// ----------------------------------------------------------------------------
// counterpart helper functions
// t and l functions surrounding translate and translate.loacalize functions
export function t (args) {
  return translate.apply(this, arguments)
}

export function l (args) {
  return translate.localize(arguments[0], arguments[1])
}

export function changeLanguage (language) {
  var lang = {
    counterpart: {
      // názvy měsíců a dní a jejich zkratky
      names: require('../../locales/'+language+'/'+language+'.dates.json').names,
      // definuje, který klíč vzít pro různý počet. Tento en rozhoduje zda vzít zero, one nebo other key.
      // vlastním plurarizerem je možné nadefinovat kdy používat i další klíče (např. jeden, dva, tri a vice - pro pripady kdy se tvary těchto počtů liší).
      pluralize: require('../../locales/'+language+'/'+language+'.pluralize.js'),
      // formáty datumů - používá strftime
      // Dokumentace k strftime - https://github.com/samsonjs/strftime#supported-specifiers
      formats: require('../../locales/'+language+'/'+language+'.dates.json').formats
    }
  }

  translate.registerTranslations(language, lang);
  translate.registerTranslations(language, require('../../locales/'+language+'/'+language+'.json'));
  translate.setLocale(language)
}

export function getLanguage() {
  return translate.getLocale()
}

// This function copies structure and content of default language ('en')
export function create(dest, lang) {
  if (!fs.existsSync(path.join(dest, lang))) {
    fs.mkdirSync(path.join(dest, lang))
    copyFile(path.join(dest, DEFAULT_LANGUAGE, DEFAULT_LANGUAGE+'.dates.json'), path.join(dest, lang, lang+'.dates.json'))
    copyFile(path.join(dest, DEFAULT_LANGUAGE, DEFAULT_LANGUAGE+'.json'), path.join(dest, lang, lang+'.json'))
    copyFile(path.join(dest, DEFAULT_LANGUAGE, DEFAULT_LANGUAGE+'.pluralize.js'), path.join(dest, lang, lang+'.pluralize.js'))
  } else {
    throw 'Language "'+ lang +'" already has structure created.'
  }
}


// ----------------------------------------------------------------------------
// CSV exporting and importing functions



// This functions were created assuming that "en" is present and is default and "en.json" contains all necessary keys. (Keys in other languages will not be taken in count)
//
// To export CSV run exportCSV(location, languages), it overrides previously generated CSV file of this name.
// CSV file will be created in folder specified by location argument
// - location is an absolute location of "localization" folder (example 'C:/app/_shared/localization')
// - languages is array of available languages, if language doesnt exist, new row in CSV will be created (example ['en', 'cz', 'es'])
//
// To import CSV run importCSV(location, csvFile), it will override all existing "lang.json" using translations in CSV
// - location - see exportCSV
// - csvFile is absolute location of CSV file you want to import
//
//
// Example use:
// import * as contentManagementSystem from '... this/file'
//
// contentManagementSystem.exportCSV('D:/Dokumenty/pid-desktop/app/_shared/localization', ['en', 'cz', 'es'])
// contentManagementSystem.importCSV('D:/Dokumenty/pid-desktop/app/_shared/localization', 'D:/Dokumenty/pid-desktop/app/_shared/localization/languages.csv')


export function exportCSV(dest, languages) {
  var toCSV = []

  var keys = Object.keys(flatten(JSON.parse(fs.readFileSync(path.join(dest, 'en', 'en.json'), 'utf8'))))
  keys.unshift("")
  toCSV.push(keys)

  languages.map(function(lang){
    var fileDest = path.join(dest, lang, lang+'.json')
    if (fs.existsSync(fileDest)){
      var langCSV = [lang]
      var content = flatten(JSON.parse(fs.readFileSync(fileDest, 'utf8')))

      for (var i = 1; i < keys.length; i++){
        content[keys[i]] == undefined ? langCSV.push("") : langCSV.push(content[keys[i]])
      }

      toCSV.push(langCSV)
    } else {
      var emptyArray = []
      for (var i = 0; i < keys.length; i++) {
        i ==0 ? emptyArray.push(lang):emptyArray.push("")
      }
      toCSV.push(emptyArray)
    }
  })

  var csvContent = Papa.unparse(transpose(toCSV));
  fs.writeFile(path.join(dest, LANGUAGES_FILE_NAME), csvContent, function(err){console.log(err);})
}


export function importCSV(dest, csvFile){
  var languages = transpose(Papa.parse(fs.readFileSync(csvFile, 'utf8')).data)


  for (var i = 1; i < languages.length; i++) {
    var lang = languages[i]

    var flatLang = {}
    for (var j = 1; j < lang.length; j++) {
      flatLang[languages[0][j]] = lang[j]
    }

    for (var key in flatLang) { // add missing translations
      if (flatLang[key] == ""){
        flatLang[key] = `${lang[0].toUpperCase()}: ${key}`
      }
    }

    var fileDest = path.join(dest, lang[0], lang[0]+'.json')

    if (lang[0] != ""){
      !fs.existsSync(path.join(dest, lang[0])) && fs.mkdirSync(path.join(dest, lang[0]))
      fs.writeFile(fileDest, JSON.stringify(unflatten(flatLang), null, '\t'), function(err){console.log(err);})
    }

  }
}

// ----------------------------------------------------------------------------
// Private functions
function transpose(matrix){
  var newArray = matrix[0].map(function(col, i) {
    return matrix.map(function(row) {
      return row[i]
    })
  });
  return newArray
}

function copyFile(from, to) {
  var content = fs.readFileSync(from, 'utf8')
  fs.writeFile(to, content, function(err){console.log(err)})
}

var unflatten = function(data) {
    "use strict";
    if (Object(data) !== data || Array.isArray(data))
        return data;
    var result = {}, cur, prop, idx, last, temp;
    for(var p in data) {
        cur = result, prop = "", last = 0;
        do {
            idx = p.indexOf(".", last);
            temp = p.substring(last, idx !== -1 ? idx : undefined);
            cur = cur[prop] || (cur[prop] = (!isNaN(parseInt(temp)) ? [] : {}));
            prop = temp;
            last = idx + 1;
        } while(idx >= 0);
        cur[prop] = data[p];
    }
    return result[""];
}

var flatten = function(data) {
    var result = {};
    function recurse (cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
             for(var i=0, l=cur.length; i<l; i++)
                 recurse(cur[i], prop ? prop+"."+i : ""+i);
            if (l == 0)
                result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop+"."+p : p);
            }
            if (isEmpty)
                result[prop] = {};
        }
    }
    recurse(data, "");
    return result;
}
