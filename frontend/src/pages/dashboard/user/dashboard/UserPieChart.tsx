// src/components/dashboard/user/UserPieChart.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import type { UserStatsResponse } from "@/types/statsType";

interface UserPieChartProps {
  stats: UserStatsResponse["data"];
}

const UserPieChart = ({ stats }: UserPieChartProps) => {
  const pieData = {
    labels: ["Pending", "Approved", "In Progress", "Resolved", "Rejected"],
    datasets: [
      {
        label: "Issue Status",
        data: [
          stats.totalPending,
          stats.totalApproved,
          stats.totalInProgress,
          stats.totalResolved,
          stats.totalRejected,
        ],
        backgroundColor: [
          "#FF6384", // Pending - Red/Pink
          "#FFCE56", // Approved - Yellow
          "#36A2EB", // In Progress - Blue
          "#4CAF50", // Resolved - Green
          "#9E9E9E", // Rejected - Gray
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(76, 175, 80, 1)",
          "rgba(158, 158, 158, 1)",
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(76, 175, 80, 0.8)",
          "rgba(158, 158, 158, 0.8)",
        ],
        hoverBorderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(76, 175, 80, 1)",
          "rgba(158, 158, 158, 1)",
        ],
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
          usePointStyle: true,
          pointStyle: "circle" as const,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
          weight: "bold" as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = stats.totalIssues;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
      title: {
        display: false,
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  return (
    <div className="w-full h-full flex flex-col">
      <h1 className="text-xl font-bold mb-4 text-gray-800">
        Issue Status Distribution
      </h1>
      <div className="relative flex-1 min-h-75">
        <Pie data={pieData} options={options} />
      </div>
    </div>
  );
};

export default UserPieChart;