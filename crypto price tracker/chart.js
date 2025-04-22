export function drawChart(ctx, labels, prices) {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Price (USD)',
          data: prices,
          borderColor: '#42a5f5',
          backgroundColor: 'rgba(66, 165, 245, 0.2)',
          fill: true,
          tension: 0.3,
          pointRadius: 1,
        }]
      },
      options: {
        responsive: false,
        scales: {
          x: { display: false },
          y: {
            ticks: { color: "#ccc" }
          }
        },
        plugins: {
          legend: { labels: { color: "#ccc" } }
        }
      }
    });
  }  