// src/pages/dashboard/admin/dashboard/Chartar.tsx 
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import type { AdminStatsResponse } from "@/types/statsType";

interface ChartarProps {
  stats: AdminStatsResponse["data"];
}

const Chartar = ({ stats }: ChartarProps) => {
  // ✅ Fixed: Use resolvedIssues instead of solvedIssues to match backend
  const pieData = {
    labels: ["Pending", "Approved", "In Progress", "Resolved", "Rejected", "Total"],
    datasets: [
      {
        label: "Issue Distribution",
        data: [
          stats.pendingIssues,
          stats.approvedIssues,
          stats.inProgressIssues,
          stats.resolvedIssues, 
          stats.rejectedIssues, 
          stats.totalIssues,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#36A2EB", "#FFCE56", "#4BC0C0"],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
        hoverBackgroundColor: [
          "rgba(255, 99, 132, 0.4)",
          "rgba(54, 162, 235, 0.4)",
          "rgba(255, 206, 86, 0.4)",
          "rgba(75, 192, 192, 0.4)",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="max-h-96 md:h-96 w-full">
      <Pie data={pieData} options={options} />
    </div>
  );
};

export default Chartar;