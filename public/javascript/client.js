var INICIADO= false;
var socket = io.connect('http://localhost:3000', { 'forceNew': true });

var pila1=[];
var pila2=[];
var pila3=[];
var pila4=[];

socket.on('meminfo_change', function(data) {
    if(INICIADO)
    {
        var memoryData= [ (data.MemTotal-data.MemFree)/1000000,data.MemFree/1000000];
        PlotRAM_Graph(memoryData,data.MemTotal,data.MemFree);
    }
});

socket.on('statinfo_change', function(data) {
    if(INICIADO)
    {
        plot_performanceCPU(data);
    }
});

socket.on('ReceivingProcess', function(data) {
    if(INICIADO)
    {
        paintInfoProcess(data.process);
    }
});

socket.on('ReceivingLogin', function(data) {
    if(!data.login)
    {
        socket.emit('quitLogin', {});
        window.location.replace("http://localhost:3000");
        INICIADO=false;
    }else
    {
        INICIADO=true;
    }
});

socket.on('summary', function(data) {
    if(INICIADO)
    {
        paintInfoSummary(data);
    }
    
});
