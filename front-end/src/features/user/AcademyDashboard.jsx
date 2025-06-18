import { useState } from "react";
import { useGetDashboard } from "../../hooks/user/academy/useGetDashboard";
import Loader from "../../ui/Loader";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiAward,
  FiXCircle,
  FiCalendar,
  FiMap,
  FiGrid,
  FiList,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import { useTranslation } from "../../context/TranslationContext";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function AcademyDashboard() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetDashboard();

  if (isLoading) return <Loader />;

  // Stats cards data with trend indicators (would be calculated from historical data)
  const statsCards = [
    {
      label: t("total_students"),
      value: data.students,
      icon: <FiUsers size={24} />,
      trend: data.trends.students, // percentage growth
      color: "indigo",
      gradientFrom: "from-indigo-400",
      gradientTo: "to-blue-500",
    },
    {
      label: t("accepted_students"),
      value: data.accepted,
      icon: <FiCheckCircle size={24} className="text-white" />,
      trend: data.trends.accepted,
      color: "emerald",
      gradientFrom: "from-emerald-400",
      gradientTo: "to-green-500",
    },
    {
      label: t("completed"),
      value: data.completed,
      icon: <FiAward size={24} className="text-white" />,
      trend: data.trends.completed,
      color: "blue",
      gradientFrom: "from-blue-400",
      gradientTo: "to-cyan-500",
    },
    {
      label: t("pending"),
      value: data.pending,
      icon: <FiClock size={24} className="text-white" />,
      trend: data.trends.pending,
      color: "amber",
      gradientFrom: "from-amber-400",
      gradientTo: "to-yellow-500",
    },
    {
      label: t("passed"),
      value: data.passed,
      icon: <FiAward size={24} />,
      color: "green",
      gradientFrom: "from-green-400",
      gradientTo: "to-emerald-500",
    },
    {
      label: t("failed"),
      value: data.failed,
      icon: <FiXCircle size={24} />,
      color: "red",
      gradientFrom: "from-red-400",
      gradientTo: "to-rose-500",
    },
    {
      label: t("todays_appointments"),
      value: data.todayAppointments,
      icon: <FiCalendar size={24} />,
      color: "purple",
      gradientFrom: "from-purple-400",
      gradientTo: "to-fuchsia-500",
    },
  ];

  // Prepare chart data
  const chartData = {
    labels: data.locations.map((loc) => loc.location),
    datasets: [
      {
        label: t("pending"),
        data: data.locations.map((loc) => loc.pending),
        backgroundColor: "rgba(245, 158, 11, 0.7)",
        borderColor: "rgba(245, 158, 11, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: t("accepted"),
        data: data.locations.map((loc) => loc.accepted),
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: t("completed"),
        data: data.locations.map((loc) => loc.completed),
        backgroundColor: "rgba(79, 70, 229, 0.7)",
        borderColor: "rgba(79, 70, 229, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#111827",
        bodyColor: "#374151",
        borderColor: "rgba(229, 231, 235, 1)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxWidth: 10,
        boxHeight: 10,
        usePointStyle: true,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw} ${t("students")}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        precision: 0,
        ticks: {
          stepSize: 1,
          callback: function (value) {
            if (value % 1 === 0) return value;
          },
        },
      },
    },
    maintainAspectRatio: false,
    barThickness: 16,
  };

  const totalPending = data.locations.reduce(
    (sum, loc) => sum + loc.pending,
    0,
  );
  const totalAccepted = data.locations.reduce(
    (sum, loc) => sum + loc.accepted,
    0,
  );
  const totalCompleted = data.locations.reduce(
    (sum, loc) => sum + loc.completed,
    0,
  );

  return (
    <div className="min-h-screen text-white">
      <header className="border-b border-gray-700 bg-black/20 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              {t("academy_dashboard")}
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}
        >
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800/50 shadow-lg backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              <div className="p-6">
                <div className="flex items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradientFrom} ${stat.gradientTo} shadow-md`}
                  >
                    <div className="text-white">{stat.icon}</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-400">
                        {stat.label}
                      </dt>
                      <dd>
                        <div className="text-2xl font-bold text-white">
                          {stat.value.toLocaleString()}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              {typeof stat.trend === "number" && (
                <div className="border-t border-gray-700/50 bg-gray-800/70 px-6 py-3 text-sm">
                  <div className="flex items-center">
                    {stat.trend > 0 ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20">
                        <FiArrowUp
                          className={`h-4 w-4 flex-shrink-0 self-center text-green-400`}
                        />
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20">
                        <FiArrowDown
                          className={`h-4 w-4 flex-shrink-0 self-center text-red-400`}
                        />
                      </div>
                    )}

                    <span
                      className={
                        stat.trend > 0
                          ? "ml-2 text-green-400"
                          : "ml-2 text-red-400"
                      }
                    >
                      {Math.abs(stat.trend)}%
                    </span>
                    <span className="ml-1 text-gray-400">
                      {t("from_last_month")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-7">
          <div className="relative overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800/50 p-6 shadow-lg backdrop-blur-sm lg:col-span-4">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl"></div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center text-xl font-semibold text-white">
                <FiMap className="mr-3 h-6 w-6 text-indigo-400" />
                {t("student_status_by_location")}
              </h2>
              <span className="inline-flex items-center rounded-full bg-indigo-900/60 px-3 py-1 text-sm font-medium text-indigo-300">
                {data.locations.length} {t("locations")}
              </span>
            </div>

            <div className="h-80">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800/50 p-6 shadow-lg backdrop-blur-sm lg:col-span-3">
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl"></div>
            <h2 className="mb-5 text-xl font-semibold text-white">
              {t("location_summary")}
            </h2>

            {/* Summary Numbers */}
            <div className="mb-8 grid grid-cols-3 gap-4">
              <div className="overflow-hidden rounded-lg bg-amber-900/20 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold text-amber-300 uppercase">
                  {t("pending")}
                </p>
                <p className="mt-2 text-2xl font-bold text-amber-100">
                  {totalPending}
                </p>
              </div>
              <div className="overflow-hidden rounded-lg bg-emerald-900/20 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold text-emerald-300 uppercase">
                  {t("accepted")}
                </p>
                <p className="mt-2 text-2xl font-bold text-emerald-100">
                  {totalAccepted}
                </p>
              </div>
              <div className="overflow-hidden rounded-lg bg-blue-900/20 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold text-blue-300 uppercase">
                  {t("completed")}
                </p>
                <p className="mt-2 text-2xl font-bold text-blue-100">
                  {totalCompleted}
                </p>
              </div>
            </div>

            {/* Top Locations */}
            <h3 className="mb-4 text-sm font-medium text-gray-300">
              {t("top_performing_locations")}
            </h3>
            <ul className="space-y-4">
              {data.locations
                .sort(
                  (a, b) =>
                    b.completed / (b.pending + b.accepted + b.completed) -
                    a.completed / (a.pending + a.accepted + a.completed),
                )
                .slice(0, 3)
                .map((location, idx) => {
                  const total =
                    location.pending + location.accepted + location.completed;
                  const completionRate = Math.round(
                    (location.completed / total) * 100,
                  );

                  return (
                    <li
                      key={idx}
                      className="flex items-center justify-between rounded-lg bg-gray-700/30 p-3 backdrop-blur-sm"
                    >
                      <div className="flex items-center">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-xs font-bold text-white">
                          {idx + 1}
                        </span>
                        <span className="ml-3 block truncate text-sm font-medium text-white">
                          {location.location}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-700">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            style={{ width: `${completionRate}%` }}
                          ></div>
                        </div>
                        <span className="ml-3 text-sm font-bold text-white">
                          {completionRate}%
                        </span>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AcademyDashboard;
