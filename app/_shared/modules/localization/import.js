console.log('running');
var fs = require('fs')
var path = require('path')
var Papa = require('./papaparse.min')

var toCSV = []
var dest = process.argv[2]
var languages = ['en', 'cs', 'pl', 'de']
const LANGUAGES_FILE_NAME = "languages.csv"

// private functions ///////////////////////////////////////////////////////////
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

function transpose(matrix){
  var newArray = matrix[0].map(function(col, i) {
    return matrix.map(function(row) {
      return row[i]
    })
  });
  return newArray
}
////////////////////////////////////////////////////////////////////////////////

var languages = transpose(Papa.parse(fs.readFileSync(dest+LANGUAGES_FILE_NAME, 'utf8')).data)


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
