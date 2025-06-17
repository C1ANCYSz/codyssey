import { format } from "date-fns";
import { FaMapMarkerAlt, FaCalendarAlt, FaTrophy } from "react-icons/fa";
import Loader from "../ui/Loader";
import { useGetAppointments } from "../hooks/user/useGetAppointments";
import { useDeleteAppointment } from "../hooks/user/useDeleteAppointment";
import { MdCancel } from "react-icons/md";
import { useState } from "react";
import { useTranslation } from "../context/TranslationContext";

function Appointments() {
  const { t } = useTranslation();
  const { appointments, isLoading } = useGetAppointments();
  const { deleteAppointment, isLoading: isDeleting } = useDeleteAppointment();
  const [selectedAppointments, setSelectedAppointments] = useState("all");
  console.log(appointments);
  const filteredAppointments =
    selectedAppointments === "all"
      ? appointments
      : appointments.filter((currAppointment) =>
          selectedAppointments === "completed"
            ? currAppointment.status === "completed"
            : selectedAppointments === "accepted"
              ? currAppointment.status === "accepted"
              : selectedAppointments === "pending"
                ? currAppointment.status === "pending"
                : selectedAppointments === "rejected"
                  ? currAppointment.status === "rejected"
                  : null,
        );

  const getStatusColor = (status) => {
    const colors = {
      accepted: "bg-emerald-500/80",
      pending: "bg-amber-500/80",
      rejected: "bg-rose-500/80",
      completed: "bg-primary-500/80",
    };
    return colors[status] || "bg-gray-500/80";
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen p-8">
      <div className="mb-12 flex items-center justify-between">
        <h1 className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
          {t("my_appointments")}
        </h1>
        <div className="flex gap-4 text-white">
          <button
            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-white capitalize transition-all duration-300 ${selectedAppointments === "all" ? "bg-primary-600/50" : "bg-white/10"}`}
            onClick={() => setSelectedAppointments("all")}
          >
            {t("all")}
          </button>
          <button
            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-white capitalize transition-all duration-300 ${selectedAppointments === "completed" ? "bg-primary-600/50" : "bg-white/10"}`}
            onClick={() => setSelectedAppointments("completed")}
          >
            {t("completed")}
          </button>
          <button
            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-white capitalize transition-all duration-300 ${selectedAppointments === "accepted" ? "bg-primary-600/50" : "bg-white/10"}`}
            onClick={() => setSelectedAppointments("accepted")}
          >
            {t("accepted")}
          </button>
          <button
            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-white capitalize transition-all duration-300 ${selectedAppointments === "pending" ? "bg-primary-600/50" : "bg-white/10"}`}
            onClick={() => setSelectedAppointments("pending")}
          >
            {t("pending")}
          </button>
          <button
            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-white capitalize transition-all duration-300 ${selectedAppointments === "rejected" ? "bg-primary-600/50" : "bg-white/10"}`}
            onClick={() => setSelectedAppointments("rejected")}
          >
            {t("rejected")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment._id}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10"
          >
            {(appointment.status === "rejected" ||
              appointment.status === "pending") && (
              <button
                onClick={() => deleteAppointment(appointment._id)}
                disabled={isDeleting}
                className="absolute top-2 right-2 animate-pulse cursor-pointer rounded-full text-2xl text-red-500 transition-all duration-1000"
              >
                <MdCancel />
              </button>
            )}
            {/* Roadmap Header */}
            <div className="mb-6 flex items-center gap-4">
              <img
                src={appointment.roadmap.image}
                alt={appointment.roadmap.title}
                className="h-20 w-20 rounded-xl object-cover ring-2 ring-white/10 transition-all duration-300 group-hover:ring-white/20"
              />
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {appointment.roadmap.title}
                </h3>
                <span
                  className={`mt-2 inline-block rounded-full px-4 py-1 text-sm font-medium text-white backdrop-blur-sm ${getStatusColor(appointment.status)}`}
                >
                  {appointment.status}
                </span>
              </div>
            </div>

            {/* Academy Info */}
            <div className="mb-6 space-y-2">
              <h4 className="text-sm font-medium text-gray-400">
                {t("academy")}
              </h4>
              <p className="text-lg font-medium text-white">
                {appointment.academy.name}
              </p>
              <p className="text-sm text-gray-400">
                {appointment.academy.email}
              </p>
            </div>

            {/* Location & Date */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <FaMapMarkerAlt className="text-primary-500" />
                <span className="text-sm">{appointment.location}</span>
              </div>

              {appointment.examDate && (
                <div className="flex items-center gap-3 text-gray-300">
                  <FaCalendarAlt className="text-primary-500" />
                  <span className="text-sm">
                    {format(
                      new Date(appointment.examDate),
                      "MMM dd, yyyy - HH:mm",
                    )}
                  </span>
                </div>
              )}

              {appointment.score && (
                <div className="mx-auto flex w-fit items-center gap-3 rounded-full bg-orange-500 px-4 py-2 text-white">
                  <FaTrophy className="text-lg" />
                  <span className="text-lg font-bold">
                    {t("score")}: {appointment.score}%
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {appointments.length === 0 && (
        <div className="mt-12 text-center text-lg text-gray-400">
          {t("no_appointments_found")}
        </div>
      )}
    </div>
  );
}

export default Appointments;
