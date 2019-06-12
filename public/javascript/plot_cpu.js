var PieChartRAM=null;
function PlotCPU_Graph()
{
    
    var ctx = document.getElementById("CPU_PerformanceChart").getContext('2d');

    var stackedLine = new Chart(ctx, {
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



function PlotRAM_Graph(dataX)
{
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


function plot_performanceCPU(id,a,b)
{
    //id="cpu1_info"
    var loadavg = ((b[0]+b[1]+b[2]+b[4]+b[5]+b[6]) - (a[0]+a[1]+a[2]+a[4]+a[5]+a[6])) /((b[0]+b[1]+b[2]+b[3]+b[4]+b[5]+b[6]) - (a[0]+a[1]+a[2]+a[3]+a[4]+a[5]+a[6]));
    loadavg =  loadavg *100;
    document.getElementById("cpu"+id+"_info").textContent= loadavg.toFixed(2) + '%';
}