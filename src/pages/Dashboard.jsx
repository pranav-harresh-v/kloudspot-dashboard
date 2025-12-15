import React from "react";
import { useSite } from "../context/SiteContext";
import { useDashboardData } from "../hooks/useDashboardData";
import { useLiveOccupancy } from "../hooks/useLiveOccupancy";
import { FIXED_HOURS } from "../config/chartConfig";
import FigmaCard from "../components/FigmaCard";
import DemographicsChart from "../components/DemographicsChart";
// 1. IMPORT THE NEW CONTAINER
import ChartContainer from "../components/ChartContainer";

const Dashboard = () => {
  const { selectedSite } = useSite();
  const { metrics, setMetrics, charts, trends, loading } =
    useDashboardData(selectedSite);
  useLiveOccupancy(selectedSite, setMetrics);

  // Gradient Helper
  const createGradient = (context) => {
    const ctx = context.chart.ctx;
    const gradient = ctx.createLinearGradient(
      0,
      context.chart.chartArea.bottom,
      0,
      context.chart.chartArea.top
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    gradient.addColorStop(1, "rgba(45, 212, 191, 0.4)");
    return gradient;
  };

  // Data 1: Occupancy (Needs Gradient)
  const occupancyChartData = {
    labels: FIXED_HOURS,
    datasets: [
      {
        label: "Occupancy",
        data: charts.occupancyData,
        fill: true,
        // Apply gradient only when chart area is ready
        backgroundColor: (context) =>
          context.chart.chartArea ? createGradient(context) : null,
        borderColor: "#2dd4bf",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        spanGaps: false,
      },
    ],
  };

  // Data 2: Demographics (No Gradient, Solid Fill)
  const demoLineData = {
    labels: FIXED_HOURS,
    datasets: [
      {
        label: "Male",
        data: charts.demoMale,
        borderColor: "#5eead4",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        fill: true,
        backgroundColor: "rgba(94, 234, 212, 0.05)",
      },
      {
        label: "Female",
        data: charts.demoFemale,
        borderColor: "#99f6e4",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        fill: true,
        backgroundColor: "rgba(153, 246, 228, 0.05)",
      },
    ],
  };

  if (loading)
    return <div className="p-10 text-center text-gray-400">Loading...</div>;

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Overview
        </h1>
        <div className="bg-white border px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-gray-600 flex items-center gap-2 cursor-pointer hover:border-teal-500 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
            />
          </svg>
          <span>Today</span>
        </div>
      </div>

      {/* Occupancy Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-700">Occupancy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FigmaCard
            title="Live Occupancy"
            value={metrics.occupancy}
            subtext="Live Update"
            trend="neutral"
            isLive={true}
          />
          <FigmaCard
            title="Today's Footfall"
            value={metrics.footfall.toLocaleString()}
            subtext={`${Math.abs(trends.footfall).toFixed(1)}% ${
              trends.footfall >= 0 ? "More" : "Less"
            } than yesterday`}
            trend={trends.footfall >= 0 ? "up" : "down"}
          />
          <FigmaCard
            title="Avg Dwell Time"
            value={metrics.dwellTime}
            subtext={`${Math.abs(trends.dwell).toFixed(1)}% ${
              trends.dwell >= 0 ? "More" : "Less"
            } than yesterday`}
            trend={trends.dwell >= 0 ? "up" : "down"}
          />
        </div>

        {/* REUSED COMPONENT: Passes 'id' for the Live Marker */}
        <ChartContainer
          title="Overall Occupancy"
          data={occupancyChartData}
          id="occupancyChart"
        />
      </div>

      {/* Demographics Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-700">Demographics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <DemographicsChart
              malePct={charts.totals.malePct}
              femalePct={charts.totals.femalePct}
            />
          </div>

          <div className="col-span-1 lg:col-span-2">
            {/* REUSED COMPONENT: Passes 'children' for the Legend */}
            <ChartContainer title="Demographics Analysis" data={demoLineData}>
              <div className="flex gap-4">
                <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-[#5eead4]"></span>{" "}
                  Male
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-[#99f6e4]"></span>{" "}
                  Female
                </span>
              </div>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
