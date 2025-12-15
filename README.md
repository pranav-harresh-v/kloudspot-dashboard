# Kloudspot Analytics Dashboard

A modern, responsive crowd analytics dashboard built with **React** and **Vite**. This application visualizes live occupancy data, footfall trends, and demographic breakdowns using interactive charts and a clean, Figma-accurate UI.

## 🚀 Features

- **Live Occupancy Tracking:** Real-time data simulation with "Live" status indicators.
- **Interactive Charts:**
- **Responsive Design:** Fully responsive sidebar navigation and grid layouts using Tailwind CSS.
- **Modular Architecture:** Reusable chart components (`ChartContainer`) and custom hooks for data fetching.

## 🛠️ Tech Stack

- **Framework:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Charts:** [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://react-chartjs-2.js.org/)
- **Routing:** React Router DOM
- **Font:** Inter (Google Fonts)

---

## 📦 Getting Started

### Prerequisites

Ensure you have **Node.js** (v16 or higher) installed on your machine.

### 1. Clone the Repository

```bash
git clone https://github.com/pranav-harresh-v/kloudspot-dashboard.git
cd kloudspot-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`.

## 📂 Project Structure

```text
src/
├── components/       # Reusable UI components (FigmaCard, DemographicsChart, ChartContainer)
├── config/           # Chart.js configurations (Grid options, Fonts)
├── context/          # Global state management (SiteContext)
├── hooks/            # Custom hooks (useDashboardData, useLiveOccupancy)
├── pages/            # Main page views (Dashboard)
└── Layout.jsx        # Main layout with Sidebar and Header
```

## 🚀 Deployment

### Deploying to Vercel (Recommended)

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  Vercel will auto-detect Vite and deploy.

**Important:** To prevent 404 errors on refresh when using React Router, ensure you have a `vercel.json` file in your root directory with the following content:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## 🛡️ License

This project is for educational/demonstration purposes.
