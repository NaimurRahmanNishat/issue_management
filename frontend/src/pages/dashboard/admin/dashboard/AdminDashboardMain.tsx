// src/pages/dashboard/admin/dashboard/AdminDashboardMain.tsx

import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import adminMan from "../../../../assets/man-with-laptop.png";
import Chartar from "./Chartar";
import Loading from "@/components/shared/Loading";
import { useGetAdminStatsQuery } from "@/redux/features/stats/statsApi";
import { NumberTicker } from "@/components/ui/number-ticker";
import { AuroraText } from "@/components/ui/aurora-text";
import LineChartPage from "./LineChartPage";
import { motion } from "framer-motion";

const AdminDashboardMain = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: adminData, isLoading, error } = useGetAdminStatsQuery();

  if (isLoading) return <Loading />;
  if (error) return <div>Failed to fetch data</div>;

  // ✅ Fixed: Match backend response structure
  const stats = adminData?.data || {
    totalIssues: 0,
    pendingIssues: 0,
    approvedIssues: 0,      
    inProgressIssues: 0,
    resolvedIssues: 0,      
    rejectedIssues: 0,   
    monthlyIssues: [],
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6, delay: 0.3 }} 
      className="flex flex-col gap-6 md:gap-8"
    >
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Left Card */}
        <div className="w-full lg:w-[60%] bg-white shadow border rounded-lg flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 w-full">
            {/* Text Section */}
            <div className="flex flex-col justify-center gap-3 p-6">
              <h1 className="text-lg md:text-xl">
                Welcome Back{" "}
                <span className="text-pink-500 font-medium">{user?.name}</span>{" "}
                🎉
              </h1>
              <p className="text-gray-700 text-sm leading-relaxed">
                You have successfully logged in as an super admin!
              </p>
              <div className="pt-4">
                <button className="bg-pink-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 transition">
                  View profile
                </button>
              </div>
            </div>

            {/* Image Section */}
            <div className="flex items-center justify-center md:justify-end p-4">
              <img
                src={adminMan}
                alt="admin"
                className="w-55 md:w-65 h-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Right Stats Grid */}
        <div className="w-full lg:w-[40%] grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-4">
          <div className="bg-white shadow border text-center rounded-lg p-4">
            <h2 className="text-base md:text-lg font-semibold mb-1">
              <AuroraText>Total Issues</AuroraText>
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 font-bold">
              <NumberTicker value={stats.totalIssues} />
            </p>
          </div>
          <div className="bg-white shadow border text-center rounded-lg p-4">
            <h2 className="text-base md:text-lg font-semibold mb-1">
              <AuroraText>Pending Issues</AuroraText>
            </h2>
            <p className="text-xl md:text-2xl font-bold">
              <NumberTicker value={stats.pendingIssues} />
            </p>
          </div>
          <div className="bg-white shadow border text-center rounded-lg p-4">
            <h2 className="text-base md:text-lg font-semibold mb-1">
              <AuroraText>Approved Issues</AuroraText>
            </h2>
            <p className="text-xl md:text-2xl font-bold">
              <NumberTicker value={stats.approvedIssues} />
            </p>
          </div>
          <div className="bg-white shadow border text-center rounded-lg p-4">
            <h2 className="text-base md:text-lg font-semibold mb-1">
              <AuroraText>In Progress</AuroraText>
            </h2>
            <p className="text-xl md:text-2xl font-bold">
              <NumberTicker value={stats.inProgressIssues} />
            </p>
          </div>
          <div className="bg-white shadow border text-center rounded-lg p-4">
            <h2 className="text-base md:text-lg font-semibold mb-1">
              <AuroraText>Solved Issues</AuroraText>
            </h2>
            <p className="text-xl md:text-2xl font-bold">
              <NumberTicker value={stats.resolvedIssues} />
            </p>
          </div>
          <div className="bg-white shadow border text-center rounded-lg p-4">
            <h2 className="text-base md:text-lg font-semibold mb-1">
              <AuroraText>Rejected Issues</AuroraText>
            </h2>
            <p className="text-xl md:text-2xl font-bold">
              <NumberTicker value={stats.rejectedIssues} />
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Left Chart */}
        <div className="w-full lg:w-[60%] bg-white shadow border rounded-lg p-4 h-fit sm:h-100 md:h-110">
          <Chartar stats={stats} />
        </div>

        {/* Right Chart */}
        <div className="w-full lg:w-[40%] bg-white shadow border rounded-lg p-4 h-100 sm:h-110">
          <LineChartPage monthlyData={stats.monthlyIssues} />
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
    </motion.div>
  );
};

export default AdminDashboardMain;