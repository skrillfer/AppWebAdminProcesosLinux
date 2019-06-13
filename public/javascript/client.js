var socket = io.connect('http://localhost:3000', { 'forceNew': true });

var pila1=[];
var pila2=[];
var pila3=[];
var pila4=[];

socket.on('meminfo_change', function(data) {
    var memoryData= [ (data.MemTotal-data.MemFree)/1000000,data.MemFree/1000000];
    setInterval(function(){PlotRAM_Graph(memoryData,data.MemTotal,data.MemFree)}, 2000);
});

socket.on('statinfo_change', function(data) {
    setInterval(function(){plot_performanceCPU(data)}, 3000);
});

socket.on('ReceivingProcess', function(data) {
    paintInfoProcess(data.process);
});
