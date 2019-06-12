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
