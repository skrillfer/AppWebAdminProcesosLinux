var socket = io.connect('http://localhost:3000', { 'forceNew': true });

var pila1=[];
var pila2=[];
var pila3=[];
var pila4=[];

socket.on('meminfo_change', function(data) {
    var memoryData= [ (data.MemTotal-data.MemFree)/1000000,data.MemFree/1000000];
    PlotCPU_Graph();
    PlotRAM_Graph(memoryData,data.MemTotal,data.MemFree);
});

socket.on('statinfo_change1', function(data) {
    plot_performanceCPU(data.id,data.usage);
});

socket.on('statinfo_change2', function(data) {
    plot_performanceCPU(data.id,data.usage);
});

socket.on('statinfo_change3', function(data) {
    plot_performanceCPU(data.id,data.usage);
});

socket.on('statinfo_change4', function(data) {
    plot_performanceCPU(data.id,data.usage);
});

