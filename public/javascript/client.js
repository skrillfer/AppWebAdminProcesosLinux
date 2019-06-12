var socket = io.connect('http://localhost:3000', { 'forceNew': true });

socket.on('meminfo_change', function(data) {
    var memoryData= [ (data.MemTotal-data.MemFree)/1000000,data.MemFree/1000000];
    //console.log(data);
    PlotCPU_Graph();
    PlotRAM_Graph(memoryData);
});

socket.on('statinfo_change', function(data) {
    //average idle percentage X % = ( idle * 100 ) / ( user + nice + system + idle + iowait + irq + softirq )
    var cpu = data.cpu;
    var cpu1 = data.cpu0;
    var cpu2 = data.cpu1;
    var cpu3 = data.cpu2;
    var cpu4 = data.cpu3;

    //var percentage_cpu =( cpu.idle * 100 ) / ( cpu.user + cpu.nice + cpu.system + cpu.idle + cpu.iowait + cpu.irq + cpu.softirq );
    //console.log('cpu:'+percentage_cpu);

    var percentage_cpu1 =( cpu1.idle * 100 ) / ( cpu1.user + cpu1.nice + cpu1.system + cpu1.idle + cpu1.iowait + cpu1.irq + cpu1.softirq );
    console.log('cpu1:'+(100-percentage_cpu1));

    var percentage_cpu2 =( cpu2.idle * 100 ) / ( cpu2.user + cpu2.nice + cpu2.system + cpu2.idle + cpu2.iowait + cpu2.irq + cpu2.softirq );
    console.log('cpu2:'+(100-percentage_cpu2));

    var percentage_cpu3 =( cpu3.idle * 100 ) / ( cpu3.user + cpu3.nice + cpu3.system + cpu3.idle + cpu3.iowait + cpu3.irq + cpu3.softirq );
    console.log('cpu3:'+(100-percentage_cpu3));

    var percentage_cpu4 =( cpu4.idle * 100 ) / ( cpu4.user + cpu4.nice + cpu4.system + cpu4.idle + cpu4.iowait + cpu4.irq + cpu4.softirq );
    console.log('cpu4:'+(100-percentage_cpu4));

});