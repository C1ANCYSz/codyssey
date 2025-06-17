import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { useGetAdminDashboard } from "../../hooks/user/admin/useGetAdminDashboard";
import Loader from "../../ui/Loader";
import { FaUsers } from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { PiStudentFill } from "react-icons/pi";
import { HiMiniBuildingLibrary } from "react-icons/hi2";
import { CiUser } from "react-icons/ci";
import { useTranslation } from "../../context/TranslationContext";

function AdminDashboard() {
  const { t } = useTranslation();
  const { dashboardData, isLoading } = useGetAdminDashboard();
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const lineChartInstance = useRef(null);
  const pieChartInstance = useRef(null);

  useEffect(() => {
    if (!dashboardData || !lineChartRef.current || !pieChartRef.current) return;

    // Cleanup previous charts
    lineChartInstance.current?.destroy();
    pieChartInstance.current?.destroy();

    const chartConfig = {
      line: {
        type: "line",
        data: {
          labels: dashboardData.usersPerDay.map((u) => u.date),
          datasets: [
            {
              label: t("students_joined"),
              data: dashboardData.usersPerDay.map((u) => u.count),
              borderColor: "#6366f1", // Modern indigo
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              fill: true,
              tension: 0.4,
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: "#e5e7eb",
                font: {
                  family: "'Inter', sans-serif",
                  weight: 500,
                },
              },
              position: "top",
            },
            tooltip: {
              mode: "index",
              intersect: false,
              backgroundColor: "rgba(17, 24, 39, 0.95)",
              titleColor: "#fff",
              bodyColor: "#fff",
              borderColor: "#374151",
              borderWidth: 1,
              padding: 12,
              cornerRadius: 8,
              titleFont: {
                family: "'Inter', sans-serif",
                size: 14,
                weight: 600,
              },
              bodyFont: {
                family: "'Inter', sans-serif",
                size: 13,
              },
            },
          },
          scales: {
            x: {
              grid: {
                color: "rgba(75, 85, 99, 0.1)",
                drawBorder: false,
              },
              ticks: {
                color: "#d1d5db",
                font: {
                  family: "'Inter', sans-serif",
                },
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(75, 85, 99, 0.1)",
                drawBorder: false,
              },
              ticks: {
                color: "#d1d5db",
                font: {
                  family: "'Inter', sans-serif",
                },
              },
              precision: 0,
            },
          },
          interaction: {
            intersect: false,
            mode: "index",
          },
        },
      },
      pie: {
        type: "pie",
        data: {
          labels: dashboardData.roadmapsByCategory.map((r) => r.category),
          datasets: [
            {
              data: dashboardData.roadmapsByCategory.map((r) => r.count),
              backgroundColor: [
                "#3b82f6", // Blue
                "#10b981", // Emerald
                "#6366f1", // Indigo
                "#f59e0b", // Amber
                "#ec4899", // Pink
              ],
              borderColor: "#1e1e2f",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: "#e5e7eb",
                font: {
                  family: "'Inter', sans-serif",
                  size: 12,
                },
              },
              position: "right",
            },
            tooltip: {
              backgroundColor: "rgba(17, 24, 39, 0.95)",
              titleColor: "#fff",
              bodyColor: "#fff",
              borderColor: "#374151",
              borderWidth: 1,
              padding: 12,
              cornerRadius: 8,
              titleFont: {
                family: "'Inter', sans-serif",
                weight: 600,
              },
              bodyFont: {
                family: "'Inter', sans-serif",
              },
            },
          },
        },
      },
    };

    lineChartInstance.current = new Chart(
      lineChartRef.current.getContext("2d"),
      chartConfig.line,
    );

    pieChartInstance.current = new Chart(
      pieChartRef.current.getContext("2d"),
      chartConfig.pie,
    );

    return () => {
      lineChartInstance.current?.destroy();
      pieChartInstance.current?.destroy();
    };
  }, [dashboardData, t]);

  if (!dashboardData) {
    return <Loader />;
  }

  const stats = [
    {
      label: t("total_roadmaps"),
      value: dashboardData.roadmaps,
      icon: <ImBooks className="text-blue-500" />,
    },
    {
      label: t("content_managers"),
      value: dashboardData.contentManagers,
      icon: <FaUsers className="text-emerald-500" />,
    },
    {
      label: t("academies"),
      value: dashboardData.academies,
      icon: <HiMiniBuildingLibrary className="text-indigo-500" />,
    },
    {
      label: t("students"),
      value: dashboardData.students,
      icon: <PiStudentFill className="text-amber-500" />,
    },
  ];

  return (
    <div className="from-primary-900 min-h-screen bg-gradient-to-br via-black to-black p-8 text-gray-100">
      <div className="mb-8 flex flex-col gap-6">
        <div className="flex gap-6">
          <div className="flex-1/3 rounded-2xl bg-gray-800/40 p-6 shadow-xl backdrop-blur-sm">
            <h2 className="mb-6 text-xl font-semibold text-white/90">
              {t("top_performing_roadmaps")}
            </h2>
            <div className="space-y-3 overflow-x-auto">
              {dashboardData.topRoadmaps.map((roadmap, index) => (
                <div
                  key={index}
                  className="transform rounded-xl bg-gray-700/30 p-4 transition-all duration-300 hover:bg-gray-700/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold tracking-wide text-white/90 capitalize">
                        {roadmap.title}
                      </span>
                      <span className="rounded-full bg-gray-600/50 px-3 py-1 text-xs font-medium text-gray-300">
                        {roadmap.category}
                      </span>
                    </div>
                    <span className="flex items-center gap-2 text-white/90">
                      <CiUser className="text-lg" />
                      <span className="font-semibold">{roadmap.count}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[450px] flex-2/3 rounded-2xl bg-gray-800/40 p-6 pb-10 shadow-xl backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white/90">
              {t("students_growth")}
            </h2>
            <div className="h-full w-full">
              <canvas ref={lineChartRef} className="h-full w-full"></canvas>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="grid flex-2/3 grow-0 grid-cols-2 grid-rows-2 gap-6">
          {stats.map(({ label, value, icon }) => (
            <div
              key={label}
              className="transform rounded-2xl bg-gray-800/40 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-gray-800/50"
            >
              <div className="flex items-center justify-between">
                <span className="text-5xl">{icon}</span>
                <span className="text-3xl font-bold text-white/90">
                  {value}
                </span>
              </div>
              <p className="mt-2 text-lg font-medium text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        <div className="h-[400px] flex-1/3 grow-0 rounded-2xl bg-gray-800/40 p-6 shadow-xl backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white/90">
            {t("roadmap_categories")}
          </h2>
          <div className="h-full w-full">
            <canvas ref={pieChartRef} className="h-full w-full"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
