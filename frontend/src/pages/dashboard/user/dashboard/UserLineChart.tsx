import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";

interface MonthlyIssue {
  month: number;
  count: number;
}

interface UserLineChartProps {
  monthlyData?: MonthlyIssue[];
}

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const UserLineChart: React.FC<UserLineChartProps> = ({ monthlyData }) => {
  
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
    <div className="w-full h-full flex flex-col">
      <h2 className="text-lg md:text-xl font-bold mb-3 text-gray-800">
        Monthly Issues Timeline
      </h2>
      
      {/* Show message if no data */}
      {safeMonthlyData.length === 0 ? (
        <div className="flex items-center justify-center flex-1 text-gray-500 text-sm">
          No issues created this year
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart 
            data={lineData}
            margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 11 }}
              stroke="#888"
            />
            <YAxis 
              allowDecimals={false}
              domain={[0, maxIssues + 2]}
              tick={{ fontSize: 11 }}
              stroke="#888"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              labelStyle={{ fontWeight: 'bold', color: '#333' }}
              itemStyle={{ color: '#ec4899' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '8px', fontSize: '12px' }}
            />
            <Line
              type="monotone"
              dataKey="issues"
              stroke="#ec4899"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#ec4899', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#ec4899' }}
              name="Issues Created"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default UserLineChart;