// === 簡易股市前端  ===

let priceChart = null;

// 範例自選股資料
const MOCK_STOCKS = [
  {
    symbol: "2330.TW",
    name: "台積電",
    last: 850.5,
    change: +6.3,
    changePct: +0.75,
    market: "TW"
  },
  {
    symbol: "2317.TW",
    name: "鴻海",
    last: 170.2,
    change: -1.8,
    changePct: -1.05,
    market: "TW"
  },
  {
    symbol: "AAPL.US",
    name: "Apple",
    last: 210.8,
    change: +1.2,
    changePct: +0.57,
    market: "US"
  },
  {
    symbol: "NVDA.US",
    name: "NVIDIA",
    last: 118.3,
    change: +4.6,
    changePct: +4.05,
    market: "US"
  },
  {
    symbol: "BTCUSDT.CRYPTO",
    name: "Bitcoin",
    last: 95000,
    change: -630,
    changePct: -0.66,
    market: "CRYPTO"
  }
];

// 範例假新聞
const MOCK_NEWS = {
  "2330.TW": [
    {
      title: "台積電法說會釋出正向展望，資本支出維持高檔",
      source: "經濟日報",
      time: "今天 14:30"
    },
    {
      title: "先進製程訂單能見度優於預期，外資上調目標價",
      source: "鉅亨網",
      time: "今天 10:15"
    }
  ],
  "2317.TW": [
    {
      title: "鴻海擴大電動車相關布局，公布新合作夥伴",
      source: "工商時報",
      time: "昨天 17:40"
    }
  ],
  "AAPL.US": [
    {
      title: "Apple 發表新一代裝置，服務營收再創新高",
      source: "Bloomberg",
      time: "2 小時前"
    }
  ],
  "NVDA.US": [
    {
      title: "NVIDIA AI 晶片需求持續強勁，法人上修獲利預估",
      source: "Reuters",
      time: "3 小時前"
    }
  ],
  "BTCUSDT.CRYPTO": [
    {
      title: "比特幣價格震盪，市場關注美國利率決策",
      source: "CoinDesk",
      time: "1 小時前"
    }
  ]
};

// 工具：取得現在時間字串
function getNowTimeString() {
  const now = new Date();
  return now.toLocaleTimeString("zh-TW", { hour12: false });
}

// 工具：針對一檔股票隨機產生「模擬走勢資料」
function generateIntradaySeries(basePrice) {
  const points = 40; // 模擬 40 個時間點
  const labels = [];
  const prices = [];

  let price = basePrice;
  let high = basePrice;
  let low = basePrice;
  let volume = 0;

  for (let i = 0; i < points; i++) {
    const minutes = i * 3; // 每 3 分鐘一個點
    const h = 9 + Math.floor(minutes / 60);
    const m = minutes % 60;
    const label = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    labels.push(label);

    // 隨機微調價格（random walk）
    const delta = (Math.random() - 0.5) * (basePrice * 0.004);
    price = Math.max(1, price + delta);

    prices.push(Number(price.toFixed(2)));
    high = Math.max(high, price);
    low = Math.min(low, price);
    volume += Math.floor(1000 + Math.random() * 5000);
  }

  const open = prices[0];
  const last = prices[prices.length - 1];

  return {
    labels,
    prices,
    open,
    high,
    low,
    volume,
    last
  };
}

// 初始化自選股表格
function renderWatchlist() {
  const tbody = document.querySelector("#watchlistTable tbody");
  tbody.innerHTML = "";

  MOCK_STOCKS.forEach((s) => {
    const tr = document.createElement("tr");
    tr.dataset.symbol = s.symbol;

    const arrow = s.change > 0 ? "▲" : s.change < 0 ? "▼" : "—";
    const cls =
      s.change > 0 ? "price-up" : s.change < 0 ? "price-down" : "price-flat";

    tr.innerHTML = `
      <td>${s.symbol}</td>
      <td>${s.name}</td>
      <td class="${cls}">${s.last.toFixed(2)}</td>
      <td class="${cls}">${arrow} ${s.change.toFixed(2)}</td>
      <td class="${cls}">${s.changePct.toFixed(2)}%</td>
    `;

    tbody.appendChild(tr);
  });

  // 點擊 row 切換股票
  tbody.addEventListener("click", (e) => {
    const tr = e.target.closest("tr");
    if (!tr) return;

    const symbol = tr.dataset.symbol;
    const stock = MOCK_STOCKS.find((s) => s.symbol === symbol);
    if (!stock) return;

    // 標記選取列
    document
      .querySelectorAll("#watchlistTable tbody tr")
      .forEach((row) => row.classList.remove("selected"));
    tr.classList.add("selected");

    updateChartForStock(stock);
  });
}

// 初始化 Chart.js
function initChart() {
  const ctx = document.getElementById("priceChart").getContext("2d");
  priceChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Price",
          data: [],
          borderWidth: 2,
          tension: 0.25,
          pointRadius: 0,
          borderColor: "#22d3ee",
          backgroundColor: "rgba(34, 211, 238, 0.16)"
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: "index",
          intersect: false
        }
      },
      interaction: {
        mode: "index",
        intersect: false
      },
      scales: {
        x: {
          ticks: {
            color: "#9ca3af",
            maxTicksLimit: 6
          },
          grid: {
            color: "rgba(31, 41, 55, 0.6)"
          }
        },
        y: {
          ticks: {
            color: "#9ca3af",
            maxTicksLimit: 6
          },
          grid: {
            color: "rgba(31, 41, 55, 0.6)"
          }
        }
      }
    }
  });
}

// 更新右側圖表 + 指標 + 假新聞
function updateChartForStock(stock) {
  const series = generateIntradaySeries(stock.last);

  // 更新圖表標題
  const chartTitle = document.getElementById("chartTitle");
  const chartSubtitle = document.getElementById("chartSubtitle");
  const badgeMarket = document.getElementById("badgeMarket");

  chartTitle.textContent = `${stock.name} (${stock.symbol})`;
  chartSubtitle.textContent = `模擬走勢資料 · 非真實報價`;
  badgeMarket.textContent = stock.market;

  // 更新 Chart.js 資料
  priceChart.data.labels = series.labels;
  priceChart.data.datasets[0].data = series.prices;

  // 上漲/下跌顏色
  const rawChange = series.last - series.open;
  const isUp = rawChange > 0;
  priceChart.data.datasets[0].borderColor = isUp ? "#22c55e" : "#f97373";
  priceChart.data.datasets[0].backgroundColor = isUp
    ? "rgba(34, 197, 94, 0.16)"
    : "rgba(248, 113, 113, 0.16)";

  priceChart.update();

  // 更新右下角迷你統計
  document.getElementById("statOpen").textContent = series.open.toFixed(2);
  document.getElementById("statHigh").textContent = series.high.toFixed(2);
  document.getElementById("statLow").textContent = series.low.toFixed(2);
  document.getElementById("statVolume").textContent =
    series.volume.toLocaleString("en-US");

  // 更新假新聞
  renderNews(stock.symbol);
}

// 渲染假新聞列表
function renderNews(symbol) {
  const list = document.getElementById("newsList");
  list.innerHTML = "";

  const items = MOCK_NEWS[symbol] || [
    {
      title: "目前沒有為這檔股票預先設定的新聞（假資料）。",
      source: "系統提示",
      time: ""
    }
  ];

  items.forEach((n) => {
    const li = document.createElement("li");
    li.className = "news-item";
    li.innerHTML = `
      <p class="news-title">${n.title}</p>
      <p class="news-meta">${n.source} · ${n.time}</p>
    `;
    list.appendChild(li);
  });
}

// 更新 header 的 last update 時間
function updateLastUpdateTime() {
  const span = document.getElementById("lastUpdate");
  span.textContent = getNowTimeString();
}

// 模擬「整體更新」動作：time + 重新生成自選股價格
function simulateRefresh() {
  // 隨機微調每檔股票的 last / change
  MOCK_STOCKS.forEach((s) => {
    const delta = (Math.random() - 0.5) * (s.last * 0.01);
    const newLast = Math.max(1, s.last + delta);
    const change = newLast - s.last;
    s.last = Number(newLast.toFixed(2));
    s.change = Number(change.toFixed(2));
    s.changePct = Number(((change / (s.last - change || 1)) * 100).toFixed(2));
  });

  renderWatchlist();
  updateLastUpdateTime();
}

// 初始化
document.addEventListener("DOMContentLoaded", () => {
  renderWatchlist();
  initChart();
  updateLastUpdateTime();

  // 預設選第一檔
  const first = MOCK_STOCKS[0];
  updateChartForStock(first);

  // 標記第一列為選中
  const firstRow = document.querySelector("#watchlistTable tbody tr");
  if (firstRow) firstRow.classList.add("selected");

  // 監聽「模擬更新」按鈕
  const btn = document.getElementById("refreshBtn");
  btn.addEventListener("click", simulateRefresh);
});
