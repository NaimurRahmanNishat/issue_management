// src/components/dashboard/user/UserDashboardMain.tsx

import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import userAvatar from "../../../../assets/man-with-laptop.png";
import Loading from "@/components/shared/Loading";
import { useGetUserStatsQuery } from "@/redux/features/stats/statsApi";
import { NumberTicker } from "@/components/ui/number-ticker";
import { AuroraText } from "@/components/ui/aurora-text";
import UserPieChart from "./UserPieChart";
import UserLineChart from "./UserLineChart";
import { Link } from "react-router-dom";

const UserDashboardMain = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: userData, isLoading, error } = useGetUserStatsQuery();

  const stats = userData?.data || {
    totalIssues: 0,
    totalReviewAndComment: 0,
    totalPending: 0,
    totalApproved: 0,
    totalInProgress: 0,
    totalResolved: 0,
    totalRejected: 0,
    totalSolved: 0, // ✅ Added default value
    monthlyIssues: [],
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Failed to fetch data</div>;

  return (
    <div className="min-h-screen flex flex-col gap-6 md:gap-8">
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
                👋
              </h1>
              <p className="text-gray-700 text-sm leading-relaxed">
                Track your issues and monitor your progress. <br />
                Keep up the great work!
              </p>
              <div className="pt-4">
                <Link 
                  to="/dashboard/create-issue" 
                  className="inline-block bg-pink-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-pink-600 transition"
                >
                  Create New Issue
                </Link>
              </div>
            </div>

            {/* Image Section */}
            <div className="flex items-center justify-center md:justify-end lg:mt-8 p-4">
              <img
                src={userAvatar}
                alt="user"
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
              <AuroraText>Pending</AuroraText>
            </h2>
            <p className="text-xl md:text-2xl font-bold text-orange-500">
              <NumberTicker value={stats.totalPending} />
            </p> 
          </div>
          <div className="bg-white shadow border text-center rounded-lg p-4">
            <h2 className="text-base md:text-lg font-semibold mb-1">
              <AuroraText>Approved</AuroraText>
            </h2>
            <p className="text-xl md:text-2xl font-bold text-orange-500">
              <NumberTicker value={stats.totalApproved} />
            </p> 
          </div>
          <div className="bg-white shadow border text-center rounded-lg p-4">
            <h2 className="text-base md:text-lg font-semibold mb-1">
              <AuroraText>In Progress</AuroraText>
            </h2>
            <p className="text-xl md:text-2xl font-bold text-blue-500">
              <NumberTicker value={stats.totalInProgress} />
            </p>
          </div>
          <div className="bg-white shadow border text-center rounded-lg p-4">
            <h2 className="text-base md:text-lg font-semibold mb-1">
              <AuroraText>Resolved</AuroraText>
            </h2>
            <p className="text-xl md:text-2xl font-bold text-green-500">
              <NumberTicker value={stats.totalResolved} />
            </p>
          </div>
          <div className="bg-white shadow border text-center rounded-lg p-4">
            <h2 className="text-base md:text-lg font-semibold mb-1">
              <AuroraText>Rejected</AuroraText>
            </h2>
            <p className="text-xl md:text-2xl font-bold text-red-500">
              <NumberTicker value={stats.totalRejected} />
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Left Chart */}
        <div className="w-full lg:w-[60%] bg-white shadow border rounded-lg p-4 h-fit sm:h-100 md:h-110">
          <UserPieChart stats={stats} />
        </div>

        {/* Right Chart */}
        <div className="w-full lg:w-[40%] min-w-0 bg-white shadow border rounded-lg p-4 h-110">
          <UserLineChart monthlyData={stats.monthlyIssues} />
        </div>
      </div>

      {/* Additional Stats Card */}
      <div className="w-full bg-white shadow border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Additional Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-linear-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Reviews & Comments
            </h3>
            <p className="text-2xl font-bold text-purple-600">
              <NumberTicker value={stats.totalReviewAndComment} />
            </p>
          </div>
          <div className="bg-linear-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Success Rate
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {stats.totalIssues > 0 
                ? Math.round((stats.totalSolved / stats.totalIssues) * 100)
                : 0}%
            </p>
          </div>
          <div className="bg-linear-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Active Issues
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              <NumberTicker value={stats.totalPending + stats.totalInProgress} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardMain;