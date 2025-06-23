import React from "react";

const EarningsChart = ({ data = [] }) => (
  <div className="earnings-chart border-gray bg-light" style={{ padding: '1rem', minWidth: 300 }}>
    <h3>Earnings Chart</h3>
    {/* Replace this with a real chart library like Chart.js or Recharts */}
    {data.length === 0 ? (
      <p>No earnings data available.</p>
    ) : (
      <ul>
        {data.map((month, i) => (
          <li key={i}>
            {month.label}: ${month.value}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default EarningsChart;