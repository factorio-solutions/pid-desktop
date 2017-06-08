var fs = require('fs')
var path = require('path')
var Papa = require('./papaparse.min')

var toCSV = []
var dest = process.argv[2]
var languages = ['en', 'cs', 'pl', 'de']
const LANGUAGES_FILE_NAME = "languages.csv"

// private functions ///////////////////////////////////////////////////////////
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

function transpose(matrix){
  var newArray = matrix[0].map(function(col, i) {
    return matrix.map(function(row) {
      return row[i]
    })
  });
  return newArray
}
////////////////////////////////////////////////////////////////////////////////

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
