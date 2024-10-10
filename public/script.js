let chart;

async function getStockData() {
  const ticker = document.getElementById("ticker").value;
  if (!ticker) return alert("Please enter a stock ticker!");

  try {
    // Fetch stock data from the Node.js backend
    const response = await fetch(`/api/stock/${ticker}`);
    const data = await response.json();

    const stockInfo = data.chart.result[0];
    const meta = stockInfo.meta;
    const prices = stockInfo.indicators.quote[0];

    const currentPrice = meta.regularMarketPrice;
    const previousClose = meta.chartPreviousClose;
    const percentChange = (((currentPrice - previousClose) / previousClose) * 100).toFixed(2);
    const highPrice = Math.max(...prices.high).toFixed(2);
    const lowPrice = Math.min(...prices.low).toFixed(2);

    // Display stock information
    document.getElementById("stock-name").textContent = meta.symbol;
    document.getElementById("current-price").textContent = `$${currentPrice.toFixed(2)}`;
    document.getElementById("percentage-change").textContent = `${percentChange}%`;
    document.getElementById("high-price").textContent = `$${highPrice}`;
    document.getElementById("low-price").textContent = `$${lowPrice}`;

    // Update the chart
    const dates = stockInfo.timestamp.map(ts => new Date(ts * 1000).toLocaleDateString());
    const closePrices = prices.close.map(price => price.toFixed(2));

    updateChart(dates, closePrices);
  } catch (error) {
    alert("Failed to fetch stock data");
    console.error(error);
  }
}

function updateChart(dates, prices) {
  const ctx = document.getElementById("stockChart").getContext("2d");

  if (chart) {
    chart.destroy(); // Destroy previous chart to avoid multiple charts overlapping
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [{
        label: "Stock Price",
        data: prices,
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        fill: false
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}
