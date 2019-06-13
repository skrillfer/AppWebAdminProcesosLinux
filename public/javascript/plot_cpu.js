var dpsCPU = []; // dataPoints
var contCPU = 0;
//______________________________________________
var dpsRAM = []; // dataPoints
var contRAM = 0;
var dataLength =20; //Cantidad de puntos visibles
var updateInterval = 1000;

var ChartPerformance_RAM = null;

//----------------------------------------------
var PieChartRAM=null;
var PerformanceCPUGraph=null;
function PlotCPU_Graph()
{
    /*dpsCPU.push({
        x: contCPU,
        y: yVal
    });*/

    try {
        //PerformanceCPUGraph.destroy();    
    } catch (error) {
        
    }
    var ctx = document.getElementById("CPU_PerformanceChart").getContext('2d');

    PerformanceCPUGraph = new Chart(ctx, {
        type: 'line',
        data:  [{
            x: 10,
            y: 20
        }, {
            x: 15,
            y: 10
        }],
        options: {
            scales: {
                yAxes: [{
                    stacked: true
                }]
            }
        }
    });

}



function PlotRAM_Graph(dataX,MemTotal,MemFree)
{
    var Libre = (MemFree/1000).toFixed(2);
    var Ocupado = (MemTotal/1000-MemFree/1000).toFixed(2);
    document.getElementById("SizeFree_RAM").textContent = Libre;
    document.getElementById("SizeOcupado_RAM").textContent =  Ocupado;
    document.getElementById("percentageUsage_RAM").textContent =  ((Ocupado*100)/(MemTotal/1000) ).toFixed(2) +"%";
    UpdateChart(Ocupado);
}   

function UpdateChart(Ocupado)
{
    if(ChartPerformance_RAM==null)
    {
        ChartPerformance_RAM = new CanvasJS.Chart("chartRAMContainer", {
            title :{
                text: "Grafica de Uso de RAM"
            },
            axisY: {
                includeZero: false
            },      
            data: [{
                type: "line",
                dataPoints: dpsRAM
            }]
        });
    }
    dpsRAM.push({
        x: contRAM++,
        y: parseInt(Ocupado,10)
    });

    if(dpsRAM.length>dataLength)
    {
        dpsRAM.shift();
    }
    if(ChartPerformance_RAM!=null)
    {
        ChartPerformance_RAM.render();
    }
    
}

function plot_performanceCPU(id,usage)
{
    document.getElementById("cpu"+id+"_info").textContent= usage.toFixed(2) + '%';
}