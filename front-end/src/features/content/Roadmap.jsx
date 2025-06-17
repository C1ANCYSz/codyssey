import { useGetRoadmap } from "../../hooks/courses/useGetRoadmap";
import {
  FaPlay,
  FaQuestionCircle,
  FaCertificate,
  FaCheck,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { useEnroll } from "../../hooks/user/enroll";
import { useGetStudent } from "../../hooks/user/useGetStudent";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import Loader from "../../ui/Loader";
import { useAddStage } from "../../hooks/user/content-manager/useAddStage";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useDeleteStage } from "../../hooks/user/content-manager/useDeleteStage";
import { useDeleteRoadmap } from "../../hooks/user/content-manager/useDeleteRoadmap";
import confetti from "canvas-confetti";
import { useTranslation } from "../../context/TranslationContext";

function Roadmap() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [stageToDelete, setStageToDelete] = useState(null);
  const [openDeleteRoadmapModal, setOpenDeleteRoadmapModal] = useState(false);
  const addStageModalRef = useRef(null);
  const containerRef = useRef(null);
  const { roadmap, isLoading, error } = useGetRoadmap();
  const { isLoggedIn, user } = useAuth();
  const { role } = user || {};
  const { enroll, isLoading: enrollLoading } = useEnroll();
  const { register, handleSubmit, reset } = useForm();
  const { studentData, isLoading: userLoading } = useGetStudent();
  const { addStage, isLoading: addStageLoading } = useAddStage();
  const { deleteStage, isLoading: deleteStageLoading } = useDeleteStage();
  const { deleteRoadmap, isLoading: deleteRoadmapLoading } = useDeleteRoadmap();

  const isEnrolled = studentData?.roadmaps?.some(
    (currentRoadmap) => currentRoadmap.roadmap._id === roadmap?._id,
  );

  const completedStages = studentData?.roadmaps?.find(
    (currentRoadmap) => currentRoadmap.roadmap._id === roadmap?._id,
  )?.completedStages;

  useEffect(() => {
    if (completedStages === roadmap?.stagesCount && isEnrolled) {
      confetti({
        particleCount: 500,
        spread: 520,
        origin: { y: -0.5 },
        colors: ["#FF0000", "#00FF00", "#0000FF"],
      });
    }
  }, [completedStages, roadmap?.stagesCount, isEnrolled]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpenModal(false);
      }
    };
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && openModal) {
        setOpenModal(false);
      }
    };
    if (openModal) {
      addStageModalRef.current.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }
    return () => {
      if (addStageModalRef.current) {
        addStageModalRef.current.removeEventListener(
          "click",
          handleClickOutside,
        );
      }
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [openModal]);

  let currentStage;

  if (
    roadmap?.stages &&
    typeof completedStages === "number" &&
    typeof roadmap.stagesCount === "number"
  ) {
    currentStage =
      completedStages === roadmap.stagesCount
        ? roadmap.stagesCount
        : (roadmap.stages.find(
            (stage) => stage.number === completedStages + 1,
          ) ?? completedStages + 1);
  }

  const onSubmit = async (data) => {
    const stageData = {
      title: data.title,
      description: data.description,
      type: data.type,
      number: roadmap.stagesCount + 1,
      ...(data.type === "quiz" && { questions: [] }),
      ...(data.type === "content" && { videos: [] }),
    };

    try {
      await addStage(stageData);
      setOpenModal(false);
      reset();
    } catch (err) {
      console.error("Failed to add stage:", err);
    }
  };

  if (isLoading || userLoading) return <Loader />;

  return (
    <div className="from-primary-900 font-body min-h-screen bg-gradient-to-br to-black">
      <AnimatePresence>
        {openDeleteRoadmapModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-footer-900 z-50 w-full max-w-md space-y-4 rounded-2xl border border-white/10 p-8 text-white shadow-2xl"
            >
              <h2 className="mb-4 bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-center text-2xl font-bold text-transparent">
                {t("are_you_sure_delete_roadmap")}
              </h2>
              <div className="flex justify-center gap-4">
                <button
                  className="rounded-full bg-gradient-to-r from-red-600 to-red-700 px-6 py-2 text-sm font-semibold text-white transition-all hover:from-red-700 hover:to-red-800 hover:shadow-lg disabled:opacity-50"
                  onClick={() => {
                    deleteRoadmap();
                    setOpenDeleteRoadmapModal(false);
                  }}
                  disabled={deleteRoadmapLoading}
                >
                  {deleteRoadmapLoading ? t("deleting") : t("yes")}
                </button>
                <button
                  className="from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 rounded-full bg-gradient-to-r px-6 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
                  onClick={() => setOpenDeleteRoadmapModal(false)}
                  disabled={deleteRoadmapLoading}
                >
                  {deleteRoadmapLoading ? t("cancelling") : t("no")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {openDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-footer-900 z-50 w-full max-w-md space-y-4 rounded-2xl border border-white/10 p-8 text-white shadow-2xl"
            >
              <h2 className="mb-4 bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-center text-2xl font-bold text-transparent">
                {t("are_you_sure_delete_stage")}
              </h2>
              <div className="flex justify-center gap-4">
                <button
                  className="rounded-full bg-gradient-to-r from-red-600 to-red-700 px-6 py-2 text-sm font-semibold text-white transition-all hover:from-red-700 hover:to-red-800 hover:shadow-lg disabled:opacity-50"
                  onClick={() => {
                    deleteStage(stageToDelete);
                    setOpenDeleteModal(false);
                  }}
                  disabled={deleteStageLoading}
                >
                  {deleteStageLoading ? t("deleting") : t("yes")}
                </button>
                <button
                  className="from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 rounded-full bg-gradient-to-r px-6 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
                  onClick={() => setOpenDeleteModal(false)}
                  disabled={deleteStageLoading}
                >
                  {deleteStageLoading ? t("cancelling") : t("no")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {openModal && (
          <motion.div
            ref={addStageModalRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              ref={containerRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-footer-900 z-50 w-full max-w-md space-y-4 rounded-2xl border border-white/10 p-8 text-white shadow-2xl"
            >
              <h2 className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-center text-2xl font-bold text-transparent">
                {t("add_stage")}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-gray-300"
                  >
                    {t("title")}
                  </label>
                  <input
                    type="text"
                    id="title"
                    placeholder={t("stage_title")}
                    className="border-primary-600/50 bg-footer-800 focus:border-primary-600 w-full rounded-lg border-2 p-2 transition-all outline-none"
                    {...register("title", { required: true })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-300"
                  >
                    {t("description")}
                  </label>
                  <input
                    type="text"
                    id="description"
                    placeholder={t("stage_description")}
                    className="border-primary-600/50 bg-footer-800 focus:border-primary-600 w-full rounded-lg border-2 p-2 transition-all outline-none"
                    {...register("description", { required: true })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <select
                    id="type"
                    className="border-primary-600/50 bg-footer-800 focus:border-primary-600 w-full rounded-lg border-2 p-2 transition-all outline-none"
                    {...register("type", { required: true })}
                  >
                    <option
                      value="content"
                      className="bg-footer-800 text-white"
                    >
                      {t("content")}
                    </option>
                    <option value="quiz" className="bg-footer-800 text-white">
                      {t("quiz")}
                    </option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 w-full cursor-pointer rounded-lg bg-gradient-to-r px-4 py-2 text-white transition-all duration-300 hover:shadow-lg"
                >
                  {t("add_stage")}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-10">
        {/* Header Section */}
        <div className="mb-8 flex flex-col items-center gap-6 border-b border-white/20 pb-4 md:flex-row">
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            src={roadmap.image}
            alt={roadmap.title}
            className="h-32 w-32 rounded-2xl object-contain shadow-2xl"
          />
          <div className="flex-1 space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-4xl font-bold text-transparent"
            >
              {roadmap.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg text-gray-300"
            >
              {roadmap.description}
            </motion.p>
            <div className="flex flex-wrap items-center gap-4">
              <span className="rounded-full border border-blue-500/30 bg-blue-500/20 px-4 py-1 text-sm text-blue-300">
                {roadmap.category}
              </span>
              <span className="text-gray-400">
                {roadmap.stagesCount} {t("stages")}
              </span>
            </div>
          </div>

          {(role === "student" || role === undefined) &&
            (!isEnrolled ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="from-primary-600 to-primary-700 rounded-full bg-gradient-to-r px-6 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg"
                onClick={() => {
                  if (isLoggedIn) {
                    enroll(roadmap._id);
                  } else {
                    navigate("/login");
                  }
                }}
                disabled={enrollLoading}
              >
                {enrollLoading ? t("enrolling") : t("enroll")}
              </motion.button>
            ) : studentData?.roadmaps.some(
                (currentRoadmap) =>
                  currentRoadmap.roadmap._id === roadmap._id &&
                  currentRoadmap.completed,
              ) ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-green-600 to-green-700 px-6 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg"
                onClick={() => {
                  navigate(`/certificates`);
                }}
              >
                <FaCertificate className="text-lg" />
                {t("get_your_certificate")}
              </motion.button>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={`/roadmaps/${roadmap._id}/stage/${currentStage?.number}`}
                  className="from-primary-600 to-primary-700 flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r px-6 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg"
                >
                  <FaPlay className="text-sm" />
                  {currentStage?.number > 1
                    ? t("continue_learning")
                    : t("start_learning")}
                </Link>
              </motion.div>
            ))}

          {role === "content manager" && (
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="from-primary-600 to-primary-700 flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r px-6 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg"
                onClick={() => setOpenModal(true)}
              >
                <FaPlus className="text-sm" />
                {t("add_stage")}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-700 px-6 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg"
                onClick={() => setOpenDeleteRoadmapModal(true)}
              >
                <FaTrash className="text-sm" />
                {t("delete_roadmap")}
              </motion.button>
            </div>
          )}
        </div>

        {/* Roadmap Progress */}
        {isLoggedIn && isEnrolled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="from-footer-900/70 to-footer-800/70 mb-8 rounded-2xl bg-gradient-to-r p-6 backdrop-blur-sm"
          >
            <h2 className="mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-2xl font-bold text-transparent">
              {t("roadmap_progress")}
            </h2>
            <div className="bg-footer-700/50 relative h-4 w-full overflow-hidden rounded-full">
              <motion.div
                initial={{ width: "0%" }}
                animate={{
                  width:
                    completedStages === roadmap.stagesCount
                      ? "100%"
                      : completedStages === 0
                        ? "0%"
                        : `${(completedStages / roadmap.stagesCount) * 100}%`,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="from-primary-600 to-primary-700 h-full rounded-full bg-gradient-to-r"
              />
            </div>
          </motion.div>
        )}

        {/* Stages Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid gap-4 md:grid-cols-2"
        >
          {roadmap.stages.map((stage, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={stage._id}
              className={`group relative overflow-visible rounded-2xl transition-all ${
                completedStages >= stage.number
                  ? "bg-gradient-to-br from-purple-700/70 to-purple-800/70"
                  : currentStage?.number === stage.number
                    ? "bg-footer-900/70 border-4 border-purple-600/50"
                    : "from-footer-700/70 to-footer-800/70 bg-gradient-to-br"
              }`}
            >
              {/* ✅ Checkmark */}
              {completedStages >= stage.number && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 text-xs text-white shadow-lg"
                >
                  <FaCheck />
                </motion.div>
              )}

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="from-primary-600/20 to-primary-500/20 text-primary-400 mb-2 inline-block rounded-full bg-gradient-to-r px-3 py-1 text-sm">
                      {t("stage")} {stage.number}
                    </span>
                    <h3 className="mb-2 text-xl font-semibold text-white">
                      {stage.title}
                    </h3>
                    <p className="text-sm text-gray-300">{stage.description}</p>
                  </div>
                  <div className="ml-4">
                    {stage.type === "quiz" ? (
                      <div className="flex items-center gap-2">
                        {stage.score !== undefined && (
                          <span className="text-sm font-semibold text-gray-300">
                            {stage.score}/{stage.questionsCount}
                          </span>
                        )}
                        <FaQuestionCircle className="text-2xl text-yellow-500" />
                      </div>
                    ) : (
                      <FaPlay className="text-primary-500 text-2xl" />
                    )}
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              <div
                className={`absolute inset-0 flex items-center justify-center gap-2 rounded-2xl opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 ${
                  currentStage?.number === stage.number ||
                  (role === "content manager" && "bg-primary-600/60")
                }`}
              >
                {currentStage?.number >= stage.number ||
                (completedStages >= stage.number && role === "student") ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-footer-800/90 rounded-full px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-black/90"
                    onClick={() => {
                      navigate(
                        `/roadmaps/${roadmap._id}/stage/${stage.number}`,
                      );
                    }}
                  >
                    {completedStages >= stage.number
                      ? stage.type === "quiz"
                        ? t("review_quiz")
                        : t("review_content")
                      : stage.type === "quiz"
                        ? t("start_quiz")
                        : stage.number === 1
                          ? t("start_learning")
                          : t("continue_learning")}
                  </motion.button>
                ) : (
                  role === "content manager" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-footer-800/90 rounded-full px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-black/90"
                      onClick={() => {
                        navigate(
                          `/roadmaps/${roadmap._id}/stage/${stage.number}`,
                        );
                      }}
                    >
                      {t("edit_stage")}
                    </motion.button>
                  )
                )}
                {role === "content manager" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full bg-gradient-to-r from-red-600 to-red-700 px-6 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg"
                    onClick={() => {
                      setStageToDelete(stage._id);
                      setOpenDeleteModal(true);
                    }}
                  >
                    {t("delete_stage")}
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Roadmap;
