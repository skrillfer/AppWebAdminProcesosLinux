var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const fs = require('fs');
require('log-timestamp');

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname+'/public/src/home.html');
});

server.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});

io.on('connection', function(socket) {
  //console.log('Alguien se ha conectado con Sockets');
  //socket.emit('messages', messages);

  /*socket.on('new-message', function(data) {
    messages.push(data);

    io.sockets.emit('messages', messages);
  });*/
});

/* = ==============================MEM INFO======================================= = */
fs.watchFile('/proc/meminfo', { recursive: true }, function(evt, name) {
  try {
    io.sockets.emit('meminfo_change', Meminfo());
    //console.log();
  } catch (error) {
    console.log(error);
  }
});


function Meminfo() {
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
/* = ========================================================================= = */


/* = ==============================STAT INFO======================================= = */
fs.watchFile('/proc/stat', { recursive: true }, function(evt, name) {
  try {
    io.sockets.emit('statinfo_change', Statinfo());
    //console.log();
  } catch (error) {
    console.log(error);
  }
});


function Statinfo() {
  var info = {};
  var data = fs.readFileSync('/proc/stat').toString();
  data.split(/\n/g).forEach(function(line){
      line = line.split(' ');

      // Ignore invalid lines, if any
      if (!line[0].includes('cpu')) {
          console.log('NO:'+line[0]);
          return;
      }
      //console.log(line);
      // Remove parseInt call to make all values strings
      if(line[0]=='cpu')
      {
        info[line[0]] = {'user':parseInt(line[2].trim(), 10),
                       'nice':parseInt(line[3].trim(), 10),
                       'system':parseInt(line[4].trim(), 10),
                       'idle':parseInt(line[5].trim(), 10),
                       'iowait':parseInt(line[6].trim(), 10),
                       'irq':parseInt(line[7].trim(), 10),
                       'softirq':parseInt(line[8].trim(), 10)
                      };
      }else
      {
        info[line[0]] = {'user':parseInt(line[1].trim(), 10),
                       'nice':parseInt(line[2].trim(), 10),
                       'system':parseInt(line[3].trim(), 10),
                       'idle':parseInt(line[4].trim(), 10),
                       'iowait':parseInt(line[5].trim(), 10),
                       'irq':parseInt(line[6].trim(), 10),
                       'softirq':parseInt(line[7].trim(), 10)
                      };
      }
      
  });
  return info;
}
/* = ========================================================================= = */
