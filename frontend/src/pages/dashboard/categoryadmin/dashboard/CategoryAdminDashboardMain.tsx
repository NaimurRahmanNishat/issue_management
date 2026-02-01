// src/components/dashboard/categoryAdmin/CategoryAdminDashboardMain.tsx

import Loading from "@/components/shared/Loading";
import { useGetCategoryAdminStatsQuery } from "@/redux/features/stats/statsApi";
import type { MonthlyIssue } from "@/types/statsType";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend,
  Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';

const CategoryAdminDashboardMain = () => {
  
  const { data: categoryadminData, isLoading, error } = useGetCategoryAdminStatsQuery();

  const stats = categoryadminData?.data || {
    category: "",
    totalIssues: 0,
    pendingIssues: 0,
    approvedIssues: 0,
    inProgressIssues: 0,
    resolvedIssues: 0,
    rejectedIssues: 0,
    monthlyPostIssue: [] as MonthlyIssue[],
  };

  // Pie Chart Data - Include all statuses
  const pieData = [
    { name: "Pending", value: stats.pendingIssues, color: "#f59e0b" },
    { name: "Approved", value: stats.approvedIssues, color: "#8b5cf6" },
    { name: "In Progress", value: stats.inProgressIssues, color: "#3b82f6" },
    { name: "Resolved", value: stats.resolvedIssues, color: "#10b981" },
    { name: "Rejected", value: stats.rejectedIssues, color: "#ef4444" }
  ].filter(item => item.value > 0);

  // Line Chart - Handle empty data
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const lineData = stats.monthlyPostIssue.map(item => ({
    month: monthNames[item.month - 1],
    issues: item.count
  }));

  // Stats Cards - Added Approved, Resolved, Rejected
  const statsCards = [
    { label: "Total Issues", value: stats.totalIssues, color: "bg-blue-500", icon: "📊" },
    { label: "Pending", value: stats.pendingIssues, color: "bg-amber-500", icon: "⏳" },
    { label: "Approved", value: stats.approvedIssues, color: "bg-purple-500", icon: "✓" },
    { label: "In Progress", value: stats.inProgressIssues, color: "bg-blue-600", icon: "🔄" },
    { label: "Resolved", value: stats.resolvedIssues, color: "bg-green-500", icon: "✅" },
    { label: "Rejected", value: stats.rejectedIssues, color: "bg-red-500", icon: "❌" },
  ];

  
  if (isLoading) return <Loading />;
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-red-500 text-xl font-semibold">Failed to fetch data</p>
        <p className="text-gray-500 mt-2">Please try again later</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-6">
      <div className="">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Category Admin Dashboard</h1>
          <p className="text-gray-600">
            Category: <span className="font-semibold capitalize">{stats.category || "Not Assigned"}</span>
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {statsCards.map((card, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}>
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Issue Status Distribution</h2>

            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value ?? 0} issues`, 'Count']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-75 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-lg">No data available</p>
                  <p className="text-sm mt-2">Issues will appear here once created</p>
                </div>
              </div>
            )}
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Monthly Issue Trends ({new Date().getFullYear()})
            </h2>
            {lineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <YAxis 
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <Tooltip 
                    formatter={(value) => [`${value ?? 0} issues`, 'Total']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="issues" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    dot={{ r: 4, fill: "#3b82f6" }}
                    activeDot={{ r: 6 }}
                    name="Issues"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-75 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-lg">No monthly data available</p>
                  <p className="text-sm mt-2">Data will show once issues are created</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-linear-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">Active Issues</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.pendingIssues + stats.approvedIssues + stats.inProgressIssues}
              </p>
              <p className="text-xs text-gray-500 mt-1">Pending + Approved + In Progress</p>
            </div>
            <div className="bg-linear-to-r from-green-50 to-green-100 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">Completion Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.totalIssues > 0 
                  ? Math.round((stats.resolvedIssues / stats.totalIssues) * 100)
                  : 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Resolved / Total Issues</p>
            </div>
            <div className="bg-linear-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">Response Required</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.pendingIssues}
              </p>
              <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CategoryAdminDashboardMain;