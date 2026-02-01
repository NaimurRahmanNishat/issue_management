// src/pages/dashboard/admin/dashboard/LineChartPage.tsx
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";

interface MonthlyIssue {
  month: number;
  count: number;
}

interface LinePageProps {
  monthlyData?: MonthlyIssue[];
}

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const LineChartPage: React.FC<LinePageProps> = ({ monthlyData }) => {
  const safeMonthlyData = Array.isArray(monthlyData) ? monthlyData : [];

  // Transform data for chart
  const lineData = monthNames.map((name, index) => {
    const found = safeMonthlyData.find((m) => m.month === index + 1);
    const count = found ? found.count : 0;
    return { 
      month: name, 
      issues: count 
    };
  });

  // Calculate max value for better YAxis domain
  const maxIssues = Math.max(...lineData.map(d => d.issues), 1);

  return (
    <div className="w-full h-full">
      <h1 className="text-xl font-bold mb-4 text-gray-800">
        Monthly Issues Line Chart
      </h1>
      
      {/* Show message if no data */}
      {safeMonthlyData.length === 0 && (
        <div className="flex items-center justify-center h-75 text-gray-500">
          No data available for this year
        </div>
      )}

      <ResponsiveContainer width="100%" height={330}>
        <LineChart 
          data={lineData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
            stroke="#666"
          />
          <YAxis 
            allowDecimals={false}
            domain={[0, maxIssues + 2]}
            tick={{ fontSize: 12 }}
            stroke="#666"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '10px' }}
          />
          <Line
            type="monotone"
            dataKey="issues"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 5, fill: '#3b82f6' }}
            activeDot={{ r: 7 }}
            name="Issues Count"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartPage;