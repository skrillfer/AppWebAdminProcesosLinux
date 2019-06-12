var PieChartRAM=null;
var PerformanceCPUGraph=null;
function PlotCPU_Graph()
{
    try {
        PerformanceCPUGraph.destroy();    
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
    
    try {
        PieChartRAM.destroy();    
    } catch (error) {
        
    }
    
    PieChartRAM=new Chart(document.getElementById("pie_chartRAM"), {
        type: 'pie',
        data: {
          labels: ["Free","Usage"],
          datasets: [{
            label: "Population (millions)",
            backgroundColor: ["#3e95cd","#c45850"],
            data: dataX
          }]
        },
        options: {
          responsive:true,
          maintainAspectRatio: false,
          title: {
            display: true,
            text: 'Memory Usage'
          }
        }
    });
}


function plot_performanceCPU(id,usage)
{
    document.getElementById("cpu"+id+"_info").textContent= usage.toFixed(2) + '%';
}