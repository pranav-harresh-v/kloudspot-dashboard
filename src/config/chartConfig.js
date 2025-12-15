import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export const FIXED_HOURS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

// --- LIVE MARKER PLUGIN ---
const liveMarkerPlugin = {
  id: "liveMarker",
  afterDraw: (chart) => {
    if (chart.canvas.id !== "occupancyChart") return;

    const {
      ctx,
      chartArea: { top, bottom },
      scales: { x },
    } = chart;
    const dataset = chart.data.datasets[0];
    const data = dataset.data;

    let lastIndex = -1;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i] !== null && data[i] !== undefined) {
        lastIndex = i;
        break;
      }
    }

    if (lastIndex < 0) return;

    const xPos = x.getPixelForValue(chart.data.labels[lastIndex]);

    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([2, 2]);
    ctx.strokeStyle = "#b91c1c";
    ctx.lineWidth = 1.5;
    ctx.moveTo(xPos, top);
    ctx.lineTo(xPos, bottom);
    ctx.stroke();

    const badgeHeight = 32;
    const badgeWidth = 14;
    const badgeY = top;

    ctx.fillStyle = "#b91c1c";
    ctx.fillRect(xPos - badgeWidth / 2, badgeY, badgeWidth, badgeHeight);

    ctx.font = "bold 9px 'Inter', sans-serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.translate(xPos, badgeY + badgeHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("LIVE", 0, 0);

    ctx.restore();
  },
};

ChartJS.register(liveMarkerPlugin);

// --- GRID OPTIONS ---
const commonFont = {
  family: "'Inter', sans-serif",
  size: 11,
  weight: 400,
};

export const gridOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { left: 0, right: 10, top: 0, bottom: 0 } },
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: "index",
      intersect: false,
      backgroundColor: "#1f2937",
      titleFont: { family: "'Inter', sans-serif", size: 13 },
      bodyFont: { family: "'Inter', sans-serif", size: 12 },
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      suggestedMax: 250,
      // 1. L-Shape: Display the border for the Y axis (Left line)
      border: {
        display: true,
        color: "#e2e8f0",
        width: 1,
      },
      grid: {
        display: true,
        color: "#e2e8f0",
        borderDash: [4, 4], // Dotted grid
        drawBorder: false, // Don't draw the heavy border again
        tickLength: 0,
        z: 1, // <--- CRITICAL: Draws grid ON TOP of the chart fill
      },
      ticks: {
        font: commonFont,
        color: "#94a3b8",
        padding: 10,
        stepSize: 50,
      },
      title: {
        display: true,
        text: "Count",
        color: "#94a3b8",
        font: { ...commonFont, size: 10 },
      },
    },
    x: {
      // 2. L-Shape: Display the border for the X axis (Bottom line)
      border: {
        display: true,
        color: "#e2e8f0",
        width: 1,
      },
      grid: {
        display: true,
        color: "#e2e8f0",
        borderDash: [4, 4],
        drawBorder: false,
        tickLength: 0,
        z: 1, // <--- CRITICAL: Draws grid ON TOP of the chart fill
      },
      ticks: {
        font: commonFont,
        color: "#94a3b8",
        maxRotation: 0,
        autoSkip: true,
        padding: 10,
      },
      title: {
        display: true,
        text: "Time",
        color: "#94a3b8",
        font: { ...commonFont, size: 10 },
      },
    },
  },
  elements: {
    point: { radius: 0, hitRadius: 10, hoverRadius: 4 },
    line: { tension: 0.4 },
  },
  interaction: { mode: "nearest", axis: "x", intersect: false },
};
