var express = require('express');
const fs = require('fs');
var watch = require('node-watch');
require('log-timestamp');

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

fs.watchFile('/proc/meminfo', { recursive: true }, function(evt, name) {
  try {
    console.log(info());
  } catch (error) {
    
  }
});

function info() {
  var info = {};
  var data = fs.readFileSync('/proc/meminfo').toString();
  data.split(/\n/g).forEach(function(line){
      line = line.split(':');

      // Ignore invalid lines, if any
      if (line.length < 2) {
          return;
      }

      // Remove parseInt call to make all values strings
      info[line[0]] = parseInt(line[1].trim(), 10);
  });

  return info;
}