const path  = require('path')

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
/* _______________________ */
var pila1=[];
var pila2=[];
var pila3=[];
var pila4=[];
/* _______________________ */

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

  socket.on('getAllProcess', function(data) {
    var arr_Path = getAllProcess("/proc");
    var arr_ProcessSend = [];
    arr_Path.forEach(
      item=>{
        arr_ProcessSend.push(getInfoSingleProcess(item));
      }
    );
    

    io.sockets.emit('ReceivingProcess', {'process':arr_ProcessSend});
  });
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
    Statinfo();
  } catch (error) {
    console.log(error);
  }
});


function Statinfo() {
  var params = [];
  var info = {};
  var data = fs.readFileSync('/proc/stat').toString();
  data.split(/\n/g).forEach(function(line){
      line = line.split(' ');

      // Ignore invalid lines, if any
      if (!line[0].includes('cpu')) {
          return;
      }
      //console.log(line);
      if(line[0]=='cpu')
      {
        info[line[0]] = [parseInt(line[2].trim(), 10),
                        parseInt(line[3].trim(), 10),
                        parseInt(line[4].trim(), 10),
                        parseInt(line[5].trim(), 10),
                        parseInt(line[6].trim(), 10),
                        parseInt(line[7].trim(), 10),
                        parseInt(line[8].trim(), 10)
                      ];
      }else
      {
        info[line[0]] = [parseInt(line[1].trim(), 10),
                       parseInt(line[2].trim(), 10),
                       parseInt(line[3].trim(), 10),
                       parseInt(line[4].trim(), 10),
                       parseInt(line[5].trim(), 10),
                       parseInt(line[6].trim(), 10),
                       parseInt(line[7].trim(), 10)
                      ];
      }
      
  });

  if(pila1<1)
  {
      pila1.push(info.cpu0);
      pila2.push(info.cpu1);
      pila3.push(info.cpu2);
      pila4.push(info.cpu3);
  }else
  {
      var a=pila1.pop();
      var b=info.cpu0;
      params.push({'id':1,"usage":calculate_PerfomanceCPU(a,b)});
      pila1.push(b);

      a=pila2.pop();
      b=info.cpu1;
      params.push({'id':2,"usage":calculate_PerfomanceCPU(a,b)});
      pila2.push(b);

      a=pila3.pop();
      b=info.cpu2;
      params.push({'id':3,"usage":calculate_PerfomanceCPU(a,b)});
      pila3.push(b);

      a=pila4.pop();
      b=info.cpu3;
      params.push({'id':4,"usage":calculate_PerfomanceCPU(a,b)});
      pila4.push(b);
      io.sockets.emit('statinfo_change', params);
  }
  return info;
}
/* = ========================================================================= = */


function calculate_PerfomanceCPU(a,b)
{
    var loadavg = ((b[0]+b[1]+b[2]+b[4]+b[5]+b[6]) - (a[0]+a[1]+a[2]+a[4]+a[5]+a[6])) /((b[0]+b[1]+b[2]+b[3]+b[4]+b[5]+b[6]) - (a[0]+a[1]+a[2]+a[3]+a[4]+a[5]+a[6]));
    loadavg =  loadavg *100;
    return loadavg;
}


function getInfoSingleProcess(path)
{ 
  var ProcessInfo_Return = {};
  var info={};
  var data = fs.readFileSync(path+'/status').toString();
  data.split(/\n/g).forEach(function(line){
    line = line.split(':');

    // Ignore invalid lines, if any
    if (line.length < 2) {
        return;
    }

    // Remove parseInt call to make all values strings
    info[line[0]] = line[1].trim();
  });

  ProcessInfo_Return['Name'] = info.Name;
  ProcessInfo_Return['State'] = info.State;
  ProcessInfo_Return['Pid'] = info.Pid;
  return ProcessInfo_Return;
  //console.log(info.Name);
  //console.log(info.State);
  //console.log(info.Pid);
}
function getAllProcess(srcpath)
{ 
  const regex = new RegExp('/[0-9]+', 'g');

  return fs.readdirSync(srcpath)
  .map(file => path.join(srcpath, file))
  .filter(path => fs.statSync(path).isDirectory())
  .filter((ruta) => {return ruta.match(regex)});  
}