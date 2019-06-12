var socket = io.connect('http://localhost:3000', { 'forceNew': true });

var pila1=[];
var pila2=[];
var pila3=[];
var pila4=[];

socket.on('meminfo_change', function(data) {
    var memoryData= [ (data.MemTotal-data.MemFree)/1000000,data.MemFree/1000000];
    //console.log(data);
    PlotCPU_Graph();
    PlotRAM_Graph(memoryData);
});

socket.on('statinfo_change', function(data) {
    if(pila1<1)
    {
        pila1.push(data.cpu0);
        pila2.push(data.cpu1);
        pila3.push(data.cpu2);
        pila4.push(data.cpu3);
    }else
    {
        var a=pila1.pop();
        var b=data.cpu0;
        plot_performanceCPU("1",a,b);
        pila1.push(b);

        a=pila2.pop();
        b=data.cpu1;
        plot_performanceCPU("2",a,b);
        pila2.push(b);

        a=pila3.pop();
        b=data.cpu2;
        plot_performanceCPU("3",a,b);
        pila3.push(b);

        a=pila4.pop();
        b=data.cpu3;
        plot_performanceCPU("4",a,b);
        pila4.push(b);
    }
    
});

