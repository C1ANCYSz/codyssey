import { useGetStudent } from "../../hooks/user/useGetStudent";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import Loader from "../../ui/Loader";
import { useGetNotification } from "../../hooks/user/useGetNotification";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthProvider";
import StudentQuestionaire from "./StudentQuestionaire";
import { useTranslation } from "../../context/TranslationContext";

function StudentDashboard() {
  const { notification: { text } = {} } = useGetNotification();
  const { studentData, isLoading } = useGetStudent();
  const { user } = useAuth();
  const { t } = useTranslation();

  const { roadmaps } = studentData || {};
  const [filter, setFilter] = useState("all");
  const filteredRoadmaps =
    filter === "all"
      ? roadmaps
      : filter === "completed"
        ? roadmaps.filter((roadmap) => roadmap.completed)
        : roadmaps.filter(
            (roadmap) =>
              roadmap.completedStages !== roadmap.roadmap.stagesCount,
          );

  useEffect(
    function () {
      if (text) {
        toast.success(text, {
          duration: 5000,
          position: "top-right",
          icon: "🔔",
        });
      }
    },
    [text],
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {!user.tookQuestionnaire && <StudentQuestionaire />}
      <div className="from-footer-900 to-footer-800 min-h-screen bg-gradient-to-br">
        <div className="flex h-screen">
          <div className="flex-1 p-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-3xl font-bold tracking-tight text-white">
                {t("your_learning_journey")}
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                {["all", "completed", "incomplete"].map((filterType) => (
                  <button
                    key={filterType}
                    className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                      filter === filterType
                        ? "bg-primary-600 shadow-primary-600/50 text-white shadow-lg"
                        : "bg-footer-800 text-footer-300 hover:bg-footer-700"
                    }`}
                    onClick={() => setFilter(filterType)}
                  >
                    {t(filterType)}
                  </button>
                ))}
              </div>
            </div>

            <div className="[&::-webkit-scrollbar-thumb]:bg-primary-600 bg-footer-800/50 [&::-webkit-scrollbar-track]:bg-footer-700 h-[calc(100vh-12rem)] overflow-y-auto rounded-2xl p-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRoadmaps?.map((roadmap) => (
                  <Link
                    to={`/roadmaps/${roadmap.roadmap._id}`}
                    key={roadmap._id}
                    className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                      roadmap.completedStages === roadmap.roadmap.stagesCount
                        ? "hover:shadow-green-600/20"
                        : "hover:shadow-primary-600/20"
                    } bg-footer-800`}
                  >
                    {roadmap.completedStages ===
                      roadmap.roadmap.stagesCount && (
                      <div className="absolute top-4 right-4 z-20 rounded-full bg-green-500 p-1">
                        <FaCheck className="text-white" />
                      </div>
                    )}
                    <div className="bg-footer-900/90 absolute inset-0" />
                    <div className="relative z-10">
                      <div className="mb-4 flex items-center gap-4">
                        <div className="aspect-square h-20 w-20 overflow-hidden rounded-lg">
                          <img
                            src={roadmap.roadmap.image}
                            alt={roadmap.roadmap.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <h4 className="text-xl font-bold text-white">
                          {roadmap.roadmap.title}
                        </h4>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="bg-footer-700 h-2 flex-1 overflow-hidden rounded-full">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              roadmap.completedStages ===
                              roadmap.roadmap.stagesCount
                                ? "bg-green-500"
                                : "bg-primary-600"
                            }`}
                            style={{
                              width: `${(roadmap.completedStages / roadmap.roadmap.stagesCount) * 100}%`,
                            }}
                          />
                        </div>
                        <span
                          className={`font-medium ${
                            roadmap.completedStages ===
                            roadmap.roadmap.stagesCount
                              ? "text-green-400"
                              : "text-primary-400"
                          }`}
                        >
                          {roadmap.completedStages ===
                          roadmap.roadmap.stagesCount
                            ? t("completed")
                            : `${roadmap.completedStages}/${roadmap.roadmap.stagesCount}`}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
