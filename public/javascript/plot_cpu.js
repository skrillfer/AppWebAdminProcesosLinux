var OCUPADO = 0;
var TABLE =null;
var HTML_TABLE = '';
var AllProcess = [];
var dpsCPU = {'cpu1':[],'cpu2':[],'cpu3':[],'cpu4':[]};
var contCPU = 0;
var ChartPerformance_CPU = null;

//______________________________________________
var dpsRAM = {'ocupado':[],'libre':[]}; // dataPoints
var contRAM = 0;
var dataLength =20; //Cantidad de puntos visibles

var ChartPerformance_RAM = null;

//----------------------------------------------
var PieChartRAM=null;
var PerformanceCPUGraph=null;

function PlotCPU_Graph(data)
{
    if(ChartPerformance_CPU==null)
    {
        ChartPerformance_CPU = new CanvasJS.Chart("chartCPU1Container", {
            animationEnabled: true,
            title :{
                text: "Grafica de Uso de CPU"
            },
            axisY: {
                includeZero: false
            },      
            data: [{
                    name: "CPU1",
                    type: "spline",
                    showInLegend: true,
                    dataPoints: dpsCPU.cpu1
                },
                {
                    name: "CPU2",
                    type: "spline",
                    showInLegend: true,
                    dataPoints: dpsCPU.cpu2
                },
                {
                    name: "CPU3",
                    type: "spline",
                    showInLegend: true,
                    dataPoints: dpsCPU.cpu3
                },
                {
                    name: "CPU4",
                    type: "spline",
                    showInLegend: true,
                    dataPoints: dpsCPU.cpu4
                }
            ],
        });
    }
    dpsCPU.cpu1.push({
        x: contCPU,
        y: parseInt(data[0].usage.toFixed(2),10)
    });
    dpsCPU.cpu2.push({
        x: contCPU,
        y: parseInt(data[1].usage.toFixed(2),10)
    });

    dpsCPU.cpu3.push({
        x: contCPU,
        y: parseInt(data[2].usage.toFixed(2),10)
    });

    dpsCPU.cpu4.push({
        x: contCPU++,
        y: parseInt(data[3].usage.toFixed(2),10)
    });

    if(dpsCPU.cpu1.length>dataLength)
    {
        dpsCPU.cpu1.shift();
        dpsCPU.cpu2.shift();
        dpsCPU.cpu3.shift();
        dpsCPU.cpu4.shift();
    }
    
    

    if(ChartPerformance_CPU!=null)
    {
        var element=document.querySelector('#_TAB_CONTENT_ > div.active');
        if(element.id=="monitorCPU")
        {
            ChartPerformance_CPU.render();
        }
        
    }
}



function PlotRAM_Graph(dataX,MemTotal,MemFree)
{

    var Libre = (MemFree/1000).toFixed(2);
    var Ocupado = (MemTotal/1000-MemFree/1000).toFixed(2);

    OCUPADO = Ocupado;
    var element=document.querySelector('#_TAB_CONTENT_ > div.active');
    if(element.id=="home")
    {
        UpdateAllProcess(Ocupado);
    }
    document.getElementById("SizeFree_RAM").textContent = Libre;
    document.getElementById("SizeOcupado_RAM").textContent =  Ocupado;
    document.getElementById("percentageUsage_RAM").textContent =  ((Ocupado*100)/(MemTotal/1000) ).toFixed(2) +"%";
    UpdateChart(Ocupado,Libre);
    /*setInterval(function(){
        
    }, 1500);*/
    
}   

function UpdateAllProcess(Ocupado)
{
    AllProcess.forEach(
        item=>{

            if(TABLE.rows('[id='+item.Pid+']').any())
            {
                var ROW_SELECTED =TABLE.row(item.Pid);
                
                try {
                    var datax=[
                        item.Pid,
                        item.Name,
                        item.State,
                        processPercentageRAM(item.VmRSS),                    
                        function ( data, type, row ) {
                              return '<button type="button" onClick="killProcess(this.id)" id="'+item.Pid+'" class="btn btn-danger">Eliminar</button>';
                        }     
                    ];

                    ROW_SELECTED.data(datax).draw();
                    
                } catch (error) {

                    TABLE
                    .row( ROW_SELECTED )
                    .remove()
                    .draw();

                    var newRow = TABLE.row.add(
                        [
                            item.Pid,
                            item.Name,
                            item.State,
                            processPercentageRAM(item.VmRSS),                    
                            function ( data, type, row ) {
                                  return '<button type="button" onClick="killProcess(this.id)" id="'+item.Pid+'" class="btn btn-danger">Eliminar</button>';
                            }
                              
                        ]
                    ).draw();
                    newRow.nodes().to$().attr('id',item.Pid);   
                }
                

            }
        }
    );
    //
}

function UpdateChart(Ocupado,Libre)
{
    if(ChartPerformance_RAM==null)
    {
        ChartPerformance_RAM = new CanvasJS.Chart("chartRAMContainer", {
            animationEnabled: true,
            title :{
                text: "Grafica de Uso de RAM"
            },
            axisY: {
                includeZero: false
            },      
            data: [{
                type: "spline",
                name: "En Uso",
                showInLegend: true,
                dataPoints: dpsRAM.ocupado
            },
            {
                type: "spline",
                name: "Libre",
                showInLegend: true,
                dataPoints: dpsRAM.libre
            }]
        });
    }
    dpsRAM.ocupado.push({
        x: contRAM,
        y: parseInt(Ocupado,10)
    });

    dpsRAM.libre.push({
        x: contRAM++,
        y: parseInt(Libre,10)
    });
    if(dpsRAM.ocupado.length>dataLength)
    {
        dpsRAM.ocupado.shift();
        dpsRAM.libre.shift();
    }
    if(ChartPerformance_RAM!=null)
    {
        var element=document.querySelector('#_TAB_CONTENT_ > div.active');
        if(element.id=="monitorRAM")
        {
            ChartPerformance_RAM.render();
        }
        
    }
}

function plot_performanceCPU(data)
{
    
    PlotCPU_Graph(data);
    
    document.getElementById("cpu"+data[0].id+"_info").textContent= data[0].usage.toFixed(2) + '%';
    document.getElementById("cpu"+data[1].id+"_info").textContent= data[1].usage.toFixed(2) + '%';
    document.getElementById("cpu"+data[2].id+"_info").textContent= data[2].usage.toFixed(2) + '%';
    document.getElementById("cpu"+data[3].id+"_info").textContent= data[3].usage.toFixed(2) + '%';
}

function loadProcess()
{
    socket.emit('getLogin', {});
    
    if(TABLE==null)
    {
        
        $(document).ready( function () {
            var jsonArray = {"Columns":[{"name":"ID","field":"id"},{"name":"Nombre","field":"nombre"},{"name":"Estado","field":"estado"},{"name":"RAM %","field":"ram"},{"name":"Kill","field":"kill"}]};
            var columnArray = jsonArray['Columns'];
            var titleArray = [];
            for (var j = 0; j < columnArray.length; j++) {
                var temp = {};
                temp['title'] = columnArray[j]["name"];
                titleArray.push(temp);
            };

            TABLE = $('#tableProcess').DataTable({ "columns": titleArray});
            
        } ); 
        
    }
    socket.emit('getAllProcess', {});
}


function paintInfoProcess(data)
{   
    AllProcess = data;
    data.forEach(
        item =>{
            
            if(!TABLE.rows('[id='+item.Pid+']').any()) 
            {
                try {
                    var newRow = TABLE.row.add(
                        [
                            item.Pid,
                            item.Name,
                            item.State,
                            processPercentageRAM(item.VmRSS),                    
                            function ( data, type, row ) {
                                  return '<button type="button" onClick="killProcess(this.id)" id="'+item.Pid+'" class="btn btn-danger">Eliminar</button>';
                            }
                              
                        ]
                    ).draw();
                    newRow.nodes().to$().attr('id',item.Pid);   
                     
                } catch (error) {
                }    
            }
        }
    );
}


function processPercentageRAM(VmRSS){
    if(OCUPADO==0)
    {
        return 0;
    }else
    {
        return ((((VmRSS/1000)/OCUPADO)*100).toFixed(2))/2;
    }
    
}
function paintInfoSummary(data)
{
    document.getElementById("outTotalProcess").textContent=data.total;
    document.getElementById("outRunProcess").textContent=data.running;
    document.getElementById("outSuspendProcess").textContent=data.sleep;
    document.getElementById("outStopProcess").textContent=data.stopped;
    document.getElementById("outZombieProcess").textContent=data.zombie;
    
}

function killProcess(id)
{
    try {
        
        eliminarRow(id);
        TABLE.row(id).remove().draw();
        TABLE.draw();

        socket.emit('killingProcess',{'id':parseInt(id,10) });

        

    } catch (error) {
        
    }
}


function eliminarRow(id)
{
    var body = document.getElementById("bodyListProcess");
    body.removeChild(document.getElementById(id))
}


function login()
{
    if(document.getElementById("input1").value && document.getElementById("input2").value)
    {
        socket.emit('saveLogin', {});       
        window.location.replace("http://localhost:3000/home");
        
    }
}


function quitLogin()
{
    
    socket.emit('quitLogin', {});
    window.location.replace("http://localhost:3000");
}