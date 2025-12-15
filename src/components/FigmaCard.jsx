import React from "react";

const FigmaCard = ({ title, value, subtext, trend, isLive }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 min-w-0">
    <div>
      {/* Lighter Title */}
      <h3 className="text-gray-500 font-medium text-sm mb-1">{title}</h3>
      {/* Semibold Value (instead of ExtraBold) */}
      <div className="text-3xl font-semibold text-gray-900 tracking-tight">
        {value}
      </div>
    </div>

    <div className="flex items-center gap-2 mt-2">
      {isLive ? (
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-bold text-green-500">{subtext}</span>
        </div>
      ) : (
        <>
          {trend !== "neutral" && (
            <svg
              className={`w-4 h-4 ${
                trend === "up" ? "text-emerald-500" : "text-red-500"
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                d={
                  trend === "up"
                    ? "M22 7L13.5 15.5L8.5 10.5L2 17"
                    : "M22 17L13.5 8.5L8.5 13.5L2 7"
                }
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {trend === "up" ? (
                <path
                  d="M16 7H22V13"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M16 17H22V11"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          )}
          {/* Lighter Subtext color */}
          <span
            className={`text-xs font-medium ${
              trend === "up"
                ? "text-emerald-500"
                : trend === "down"
                ? "text-red-500"
                : "text-gray-400"
            }`}
          >
            {subtext}
          </span>
        </>
      )}
    </div>
  </div>
);

export default FigmaCard;
