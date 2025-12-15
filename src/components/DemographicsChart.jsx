import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

// 1. Updated Avatars to accept a direct 'fill' prop
const MaleAvatar = ({ fill, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={fill}
    className={className}
  >
    <path d="M9 11.75c-.69 0-1.25.56-1.25 1.25v9c0 .69.56 1.25 1.25 1.25h6c.69 0 1.25-.56 1.25-1.25v-9c0-.69-.56-1.25-1.25-1.25H9zM12 2c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
  </svg>
);

const FemaleAvatar = ({ fill, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={fill}
    className={className}
  >
    <path d="M12 2c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-4 9c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-7c0-1.1-.9-2-2-2H8z" />
    <path d="M9 21v1c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9z" opacity=".5" />
  </svg>
);

const DemographicsChart = ({ malePct = 0, femalePct = 0 }) => {
  // Exact colors for both Chart and Avatars
  const maleColor = "#77A8A8"; // Muted Teal
  const femaleColor = "#B2DCDC"; // Soft Mint

  const data = {
    labels: ["Males", "Females"],
    datasets: [
      {
        data: [malePct, femalePct],
        backgroundColor: [maleColor, femaleColor],
        borderWidth: 0,
        spacing: 6,
        borderRadius: 20,
        hoverOffset: 4, // Keeps the hover effect
      },
    ],
  };

  const options = {
    cutout: "75%",
    layout: {
      // 2. FIXED: Add padding so the hover expansion doesn't get cut off
      padding: 10,
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center">
      <h3 className="w-full font-bold text-gray-700 mb-4 text-left">
        Chart of Demographics
      </h3>

      {/* 3. Container needs to be slightly larger to accommodate padding */}
      <div className="relative h-52 w-52 mb-6">
        <Doughnut data={data} options={options} />

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-gray-400 text-[10px] font-bold tracking-wider uppercase">
            Total Crowd
          </p>
          <p className=" font-bold text-gray-900">100%</p>
        </div>
      </div>

      <div className="w-full space-y-3 px-2">
        <div className="flex items-center">
          {/* 4. Pass exact color variable to fill prop */}
          <MaleAvatar className="w-6 h-8 mr-3" fill={maleColor} />
          <span className="text-sm font-bold text-gray-700">
            {Math.round(malePct)}% Males
          </span>
        </div>
        <div className="flex items-center">
          <FemaleAvatar className="w-6 h-8 mr-3" fill={femaleColor} />
          <span className="text-sm font-bold text-gray-700">
            {Math.round(femalePct)}% Females
          </span>
        </div>
      </div>
    </div>
  );
};

export default DemographicsChart;
