import React from "react";
import { Line } from "react-chartjs-2";
import { gridOptions } from "../config/chartConfig";

const ChartContainer = ({ title, data, id, children }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-w-0">
      {/* Header: Title on left, Optional Legend/Controls on right */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-700">{title}</h3>
        {children}
      </div>

      {/* Chart Wrapper */}
      <div className="h-64 w-full relative">
        <Line
          id={id} // Crucial for the Live Marker plugin to find the right chart
          data={data}
          options={gridOptions}
        />
      </div>
    </div>
  );
};

export default ChartContainer;
