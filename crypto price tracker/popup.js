const selectedCoins = ["bitcoin", "ethereum"];
const priceList = document.getElementById("price-list");
const chartCtx = document.getElementById("priceChart").getContext("2d");

const colors = {
  bitcoin: "#f7931a",
  ethereum: "#3c3c3d",
  litecoin: "#d1d1d1",
};

const sparklineData = {
  bitcoin: [],
  ethereum: [],
  litecoin: []
};

const chartData = {
  labels: [],
  datasets: selectedCoins.map((coin) => ({
    label: coin.toUpperCase(),
    data: [],
    borderColor: colors[coin] || "#00ffcc",
    backgroundColor: (colors[coin] || "#00ffcc") + "33",
    tension: 0.4,
    fill: true,
    pointRadius: 3,
    pointHoverRadius: 6,
  })),
};

const chart = new Chart(chartCtx, {
  type: "line",
  data: chartData,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#fff", font: { weight: "bold" } } },
    },
    scales: {
      x: { ticks: { color: "#aaa" } },
      y: { ticks: { color: "#aaa" } },
    },
  },
});

function drawSparkline(canvas, data) {
  const ctx = canvas.getContext("2d");
  canvas.width = 100;
  canvas.height = 30;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (data.length < 2) return;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const stepX = canvas.width / (data.length - 1);
  const scaleY = max !== min ? canvas.height / (max - min) : 1;

  ctx.beginPath();
  ctx.strokeStyle = data[data.length - 1] >= data[0] ? "lime" : "red";
  ctx.lineWidth = 2;
  data.forEach((val, i) => {
    const x = i * stepX;
    const y = canvas.height - (val - min) * scaleY;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
}

async function updatePrices() {
  priceList.innerHTML = "";
  const timestamp = new Date().toLocaleTimeString();

  for (let coin of selectedCoins) {
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`);
      const data = await res.json();
      const price = data[coin].usd;

      // Update Chart
      const dataset = chart.data.datasets.find(d => d.label === coin.toUpperCase());
      if (dataset) dataset.data.push(price);

      chart.data.labels.push(timestamp);
      chart.update();

      // Update Sparkline Data
      if (!sparklineData[coin]) sparklineData[coin] = [];
      sparklineData[coin].push(price);
      if (sparklineData[coin].length > 20) sparklineData[coin].shift();

      // Create Entry
      const entryDiv = document.createElement("div");
      entryDiv.className = "price-entry";

      const text = document.createElement("div");
      text.textContent = `${coin.toUpperCase()}: $${price}`;

      const canvas = document.createElement("canvas");
      canvas.className = "sparkline";
      drawSparkline(canvas, sparklineData[coin]);

      entryDiv.appendChild(text);
      entryDiv.appendChild(canvas);
      priceList.appendChild(entryDiv);
    } catch (err) {
      console.error(`Error fetching ${coin} price:`, err);
    }
  }
}

document.getElementById("exportBtn").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "crypto_chart.png";
  link.href = document.getElementById("priceChart").toDataURL("image/png");
  link.click();
});

// Toggle Dark/Light Mode
document.getElementById("modeToggle").addEventListener("change", (e) => {
  document.documentElement.classList.toggle("dark", !e.target.checked);
  document.documentElement.classList.toggle("light", e.target.checked);
});

// Coin selection
document.getElementById("coinSelect").addEventListener("change", (e) => {
  selectedCoins.length = 0;
  selectedCoins.push(e.target.value);
  chart.data.datasets = [{
    label: e.target.value.toUpperCase(),
    data: [],
    borderColor: colors[e.target.value] || "#00ffcc",
    backgroundColor: (colors[e.target.value] || "#00ffcc") + "33",
    tension: 0.4,
    fill: true,
    pointRadius: 3,
    pointHoverRadius: 6,
  }];
  chart.data.labels = [];
  chart.update();
  updatePrices();
});

updatePrices();
setInterval(updatePrices, 30000);