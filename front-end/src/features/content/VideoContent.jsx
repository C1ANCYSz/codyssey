import { useGetStage } from "../../hooks/courses/useGetStage";
import { useGetRoadmap } from "../../hooks/courses/useGetRoadmap";
import {
  FaArrowLeft,
  FaArrowRight,
  FaEdit,
  FaPlay,
  FaPlus,
  FaTrash,
  FaSave,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import YoutubePlayer from "../../ui/YoutubePlayer";
import { useEffect, useState } from "react";
import Loader from "../../ui/Loader";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useUpdateStageContent } from "../../hooks/user/content-manager/useUpdateStageContent";
import { useUpdateStageProgress } from "../../hooks/user/useUpdateStageProgress";
import { useGetUser } from "../../hooks/user/useGetUser";
import { useGetStudent } from "../../hooks/user/useGetStudent";
import { useTranslation } from "../../context/TranslationContext";

function AddVideosForm({ stage, updateStageContent }) {
  console.log(stage);
  const { t } = useTranslation();
  const [videosArray, setVideosArray] = useState([]);
  const { _id: stageId } = stage || {};
  const { register, handleSubmit, getValues, setValue } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    const newVideos = data.videos.map((video) => ({
      ...video,
      url: video.url.slice(0, video.url.indexOf("&")),
    }));
    const newStage = {
      ...stage,
      videos: [...stage?.videos, ...newVideos],
    };
    console.log(newStage);
    updateStageContent(
      {
        stageId,
        data: newStage,
      },
      {
        onSuccess: () => {
          setVideosArray([]);
        },
      },
    );
  };
  return (
    <motion.form
      key="form"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-fit grow flex-col items-center gap-4 overflow-hidden rounded-xl bg-gray-800/40 p-6 backdrop-blur-sm"
    >
      <h3 className="text-2xl font-semibold">{t("add_videos")}</h3>
      <AnimatePresence>
        {videosArray?.map((video, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex w-full gap-4"
          >
            <input
              type="text"
              placeholder={t("video_title")}
              className="bg-footer-800 ring-primary-500 flex-1 rounded-lg px-4 py-2 text-white outline-none focus:ring-2"
              {...register(`videos.${index}.title`, {
                required: true,
              })}
            />
            <input
              type="text"
              placeholder={t("video_url")}
              className="bg-footer-800 ring-primary-500 flex-1 rounded-lg px-4 py-2 text-white outline-none focus:ring-2"
              {...register(`videos.${index}.url`, {
                required: true,
              })}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => {
                setVideosArray((curr) => curr.filter((_, i) => i !== index));
                const values = getValues();
                const newVideos = values.videos.filter((_, i) => i !== index);
                setValue("videos", newVideos);
              }}
              className="text-xl text-red-400 hover:text-red-500"
            >
              <FaTrash />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() =>
            setVideosArray([...videosArray, { title: "", url: "" }])
          }
          className="bg-primary-700 hover:bg-primary-600 rounded-full px-6 py-2 font-bold text-white transition-colors"
        >
          <FaPlus />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-primary-700 hover:bg-primary-600 rounded-full px-6 py-2 font-bold text-white transition-colors"
        >
          {t("add_videos")}
        </motion.button>
      </div>
    </motion.form>
  );
}

function AddDocsForm({ stage, updateStageContent, docsArray, setDocsArray }) {
  console.log(stage);
  const { t } = useTranslation();
  const { _id: stageId } = stage;
  const { register, handleSubmit, getValues, setValue } = useForm();
  const onDocSubmit = (data) => {
    // Filter out docs that already exist based on URL
    const filteredNewDocs = data.docs
      .filter(
        (newDoc) =>
          !stage.docs?.some(
            (existingDoc) => existingDoc.url === newDoc.url.toString(),
          ),
      )
      .map((doc) => ({
        ...doc,
        url: doc.url.toString(),
      }));

    const newStage = {
      ...stage,
      docs: [...(stage.docs || []), ...filteredNewDocs],
    };
    updateStageContent(
      {
        stageId,
        data: newStage,
      },
      {
        onSuccess: () => {
          setDocsArray([]);
        },
      },
    );
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onDocSubmit)}
      className="mt-4 space-y-4"
    >
      <AnimatePresence mode="popLayout">
        {docsArray.map((doc, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-footer-800/50 flex items-center gap-4 rounded-xl p-4 backdrop-blur-sm"
          >
            <input
              type="text"
              placeholder={t("document_title")}
              className="bg-footer-800 ring-primary-500 hover:bg-footer-700 flex-1 rounded-lg px-4 py-2 text-white transition-all duration-200 outline-none focus:ring-2"
              {...register(`docs.${index}.title`, { required: true })}
            />
            <input
              type="text"
              placeholder={t("document_url")}
              className="bg-footer-800 ring-primary-500 hover:bg-footer-700 flex-1 rounded-lg px-4 py-2 text-white transition-all duration-200 outline-none focus:ring-2"
              {...register(`docs.${index}.url`, { required: true })}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => {
                setDocsArray((curr) => curr.filter((_, i) => i !== index));
                const values = getValues();
                const newDocs = values.docs.filter((_, i) => i !== index);
                setValue("docs", newDocs);
              }}
              className="text-xl text-red-400 transition-colors duration-200 hover:text-red-500"
            >
              <FaTrash />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
      {docsArray.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-primary-700 hover:bg-primary-600 hover:shadow-primary-500/20 rounded-full px-6 py-2 font-bold text-white shadow-lg transition-all duration-300"
        >
          {t("add_documents")}
        </motion.button>
      )}
    </motion.form>
  );
}

function VideoContent() {
  const navigate = useNavigate();
  const { t, currentLanguage } = useTranslation();
  const { register, handleSubmit } = useForm();

  const { updateStageProgress } = useUpdateStageProgress();
  const [docsArray, setDocsArray] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editingDocId, setEditingDocId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    url: "",
  });
  const [editDocFormData, setEditDocFormData] = useState({
    title: "",
    url: "",
  });
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { stage: { stage } = {}, isLoading, error } = useGetStage();
  const { studentData, isLoading: studentLoading } = useGetStudent();
  const [isNextStageDisabled, setIsNextStageDisabled] = useState(true);
  const { user, isLoading: userLoading } = useGetUser();
  const {
    docs,
    number,
    title,
    type,
    videos,
    roadmap: roadmapId,
    _id: stageId,
    description,
  } = stage || {};

  const {
    updateStageContent,
    isLoading: updateStageLoading,
    error: updateStageError,
  } = useUpdateStageContent();

  const {
    roadmap: { stagesCount } = {},
    isLoading: roadmapLoading,
    error: roadmapError,
  } = useGetRoadmap();

  useEffect(() => {
    if (videos?.length > 0) {
      const videoId = videos[0].url.slice(videos[0].url.indexOf("v=") + 2);
      setSelectedVideo(videoId);
    }
  }, [videos]);

  useEffect(() => {
    if (number === stagesCount) {
      setIsNextStageDisabled(true);
    }
    if (
      selectedVideo ===
      videos?.at(-1)?.url?.slice(videos?.at(-1)?.url?.indexOf("v=") + 2)
    ) {
      setIsNextStageDisabled(false);
    }
  }, [number, stagesCount, selectedVideo]);

  function handleSubmitStageInfo(data) {
    updateStageContent(
      {
        stageId,
        data: {
          ...stage,
          title: data.title,
          description: data.description,
          number: data.number,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          navigate(`/roadmaps/${roadmapId}/stage/${data.number}`);
        },
      },
    );
  }

  function handleDeleteVideo(video) {
    const newVideos = videos.filter((v) => v.url !== video.url);
    updateStageContent({
      stageId,
      data: { ...stage, videos: newVideos },
    });
  }

  function handleDeleteDoc(doc) {
    const newDocs = docs.filter((d) => d.url !== doc.url);
    updateStageContent({
      stageId,
      data: { ...stage, docs: newDocs },
    });
  }

  function handleEditVideo(video) {
    setEditingVideoId(video.url);
    setEditFormData({
      title: video.title,
      url: video.url,
    });
  }

  function handleEditDoc(doc) {
    setEditingDocId(doc.url);
    setEditDocFormData({
      title: doc.title,
      url: doc.url,
    });
  }

  function handleUpdateStageProgress() {
    if (
      studentData?.roadmaps?.find(
        (roadmap) => roadmap.roadmap._id === roadmapId,
      )?.completedStages ===
      number - 1
    ) {
      updateStageProgress();
    } else {
      navigate(`/roadmaps/${roadmapId}/stage/${number + 1}`);
    }
  }

  function handleSaveEdit() {
    const newVideos = videos.map((video) => {
      if (video.url === editingVideoId) {
        return {
          ...video,
          title: editFormData.title,
          url: editFormData.url.slice(
            0,
            editFormData.url.indexOf("&") === -1
              ? editFormData.url.length
              : editFormData.url.indexOf("&"),
          ),
        };
      }
      return video;
    });

    updateStageContent({
      stageId,
      data: { ...stage, videos: newVideos },
    });

    setEditingVideoId(null);
    setEditFormData({ title: "", url: "" });
  }

  function handleSaveDocEdit() {
    const newDocs = docs.map((doc) => {
      if (doc.url === editingDocId) {
        return {
          ...doc,
          title: editDocFormData.title,
          url: editDocFormData.url,
        };
      }
      return doc;
    });

    updateStageContent({
      stageId,
      data: { ...stage, docs: newDocs },
    });

    setEditingDocId(null);
    setEditDocFormData({ title: "", url: "" });
  }

  const handleVideoSelect = (videoId) => {
    setSelectedVideo(videoId);
  };

  if (isLoading || roadmapLoading || updateStageLoading || studentLoading)
    return <Loader />;
  if (error || roadmapError || updateStageError)
    return <div>Error: {error.message}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black"
    >
      <div className="overflow-y-auto px-6 py-6 text-white">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex items-center justify-between"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/roadmaps/${roadmapId}`)}
            className="hover:bg-primary-600 flex cursor-pointer items-center gap-2 rounded-full bg-gray-800/40 px-4 py-2 text-lg transition-all duration-300"
          >
            <FaArrowLeft />
            <span className="font-bold capitalize">{t("back_to_roadmap")}</span>
          </motion.button>
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-primary-700 rounded-full px-4 py-2 text-sm font-bold text-white select-none"
          >
            {currentLanguage === "en"
              ? `stage ${number} from ${stagesCount}`
              : `المرحلة ${number}  من ${stagesCount}`}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-10 space-y-4"
        >
          <div className="flex items-center gap-4">
            <span className="bg-primary-700 rounded-full px-4 py-2 text-sm font-bold text-white capitalize select-none">
              {type}
            </span>
            {isEditing ? (
              <input
                type="text"
                defaultValue={title}
                {...register("title")}
                className="bg-footer-800 ring-primary-500 rounded-lg px-4 py-2 text-white outline-none focus:ring-2"
              />
            ) : (
              <h2 className="text-3xl font-semibold capitalize">{title}</h2>
            )}
            {user?.role === "content manager" && (
              <button
                className="cursor-pointer rounded-full bg-emerald-600 px-4 py-1 transition-all duration-200 hover:bg-emerald-700"
                onClick={() => {
                  if (!isEditing) setIsEditing(true);
                  if (isEditing) {
                    handleSubmit(handleSubmitStageInfo)();
                  }
                }}
              >
                {isEditing ? t("done") : t("edit")}
              </button>
            )}
          </div>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <label className="text-lg font-semibold">
                {t("stage_number")}{" "}
              </label>
              <input
                type="number"
                defaultValue={number}
                className="bg-footer-800/50 w-16 rounded-lg border border-gray-400 px-2 py-2 text-center text-white outline-none"
                {...register("number", {
                  valueAsNumber: true,
                  required: {
                    value: true,
                    message: t("stage_number_required"),
                  },
                  min: 1,
                })}
              />
            </motion.div>
          )}
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <label className="text-lg font-semibold">
                {t("stage_description_label")}{" "}
              </label>

              <textarea
                rows={3}
                defaultValue={description}
                className="bg-footer-800/50 w-64 rounded-lg border border-gray-400 px-4 py-2 text-white outline-none"
                {...register("description", {
                  required: {
                    value: true,
                    message: t("description_required"),
                  },
                })}
              />
            </motion.div>
          ) : (
            <p className="text-lg text-gray-400/80">{description}</p>
          )}
        </motion.div>

        <div>
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">{t("videos")}</h2>
              {user?.role === "student" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isNextStageDisabled}
                  className={`group flex items-center gap-2 rounded-full px-4 py-2 text-lg font-bold text-white capitalize select-none ${
                    number === stagesCount
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  } ${
                    isNextStageDisabled
                      ? "cursor-not-allowed bg-gray-600"
                      : "bg-primary-700 hover:bg-primary-600 cursor-pointer"
                  } `}
                  onClick={handleUpdateStageProgress}
                >
                  {t("next_stage")}
                  <FaArrowRight className="transition-all duration-300 hover:translate-x-1" />
                </motion.button>
              )}
            </div>

            <div className="mt-6 flex gap-6">
              <AnimatePresence mode="wait">
                {user?.role === "student" ? (
                  <motion.div
                    key="player"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="overflow-hidden rounded-xl shadow-2xl"
                  >
                    <YoutubePlayer
                      key={selectedVideo}
                      videoId={selectedVideo}
                      width="1000rem"
                      height="600px"
                    />
                  </motion.div>
                ) : (
                  <AddVideosForm
                    stage={stage}
                    updateStageContent={updateStageContent}
                  />
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 rounded-xl bg-gray-800/40 p-6 backdrop-blur-sm"
              >
                <h3 className="border-b border-gray-700 pb-4 text-center text-4xl font-semibold tracking-wider">
                  {t("playlist")}
                </h3>
                <ul className="mt-6 max-h-[500px] space-y-4 divide-y divide-gray-700/50 overflow-y-auto">
                  <AnimatePresence>
                    {videos?.map((video) => {
                      const videoId = video.url.slice(
                        video.url.indexOf("v=") + 2,
                      );
                      return (
                        <motion.li
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          key={videoId}
                          className={`group hover:bg-footer-800/50 relative mr-5 flex cursor-pointer items-center gap-4 rounded-lg p-4 transition-all duration-300 ${
                            selectedVideo === videoId ? "bg-primary-700" : ""
                          }`}
                          onClick={() => handleVideoSelect(videoId)}
                        >
                          <div className="relative h-[100px] w-[150px] overflow-hidden rounded-lg">
                            <img
                              src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                              alt={video.title}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                              <FaPlay className="text-4xl text-white drop-shadow-lg" />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {editingVideoId === video.url ? (
                              <div className="flex flex-col gap-2">
                                <input
                                  type="text"
                                  value={editFormData.title}
                                  onChange={(e) =>
                                    setEditFormData({
                                      ...editFormData,
                                      title: e.target.value,
                                    })
                                  }
                                  className="bg-footer-800 ring-primary-500 rounded-lg px-4 py-2 text-white outline-none focus:ring-2"
                                />
                                <input
                                  type="text"
                                  value={editFormData.url}
                                  onChange={(e) =>
                                    setEditFormData({
                                      ...editFormData,
                                      url: e.target.value,
                                    })
                                  }
                                  className="bg-footer-800 ring-primary-500 rounded-lg px-4 py-2 text-white outline-none focus:ring-2"
                                />
                              </div>
                            ) : (
                              <>
                                <p className="text-lg font-medium text-gray-200 transition-colors group-hover:text-white">
                                  {video.title}
                                </p>
                                <span className="text-sm text-gray-400">
                                  {t("click_to_play")}
                                </span>
                              </>
                            )}
                          </div>
                          {user?.role !== "student" && (
                            <motion.div className="ml-auto flex items-center gap-2">
                              {editingVideoId === video.url ? (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  type="button"
                                  className="ml-auto cursor-pointer text-2xl text-green-400"
                                  onClick={handleSaveEdit}
                                >
                                  <FaSave />
                                </motion.button>
                              ) : (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  type="button"
                                  className="ml-auto cursor-pointer text-2xl text-white"
                                  onClick={() => handleEditVideo(video)}
                                >
                                  <FaEdit />
                                </motion.button>
                              )}
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => handleDeleteVideo(video)}
                                className="ml-auto cursor-pointer text-xl text-red-400 hover:text-red-500"
                              >
                                <FaTrash />
                              </motion.button>
                            </motion.div>
                          )}
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">{t("documents")}</h2>
              {user?.role === "content manager" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setDocsArray([...docsArray, { title: "", url: "" }])
                  }
                  className="bg-primary-700 hover:bg-primary-600 cursor-pointer rounded-full px-6 py-2 font-bold text-white transition-colors"
                >
                  <FaPlus />
                </motion.button>
              )}
            </div>
            {user?.role === "content manager" && docsArray.length > 0 && (
              <AddDocsForm
                stage={stage}
                updateStageContent={updateStageContent}
                docsArray={docsArray}
                setDocsArray={setDocsArray}
              />
            )}
            <ul className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {docs?.map((doc) => (
                <motion.li
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  key={doc.url}
                  className="bg-footer-800/50 relative rounded-2xl p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
                >
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex cursor-pointer flex-col items-center gap-3"
                  >
                    <div className="group-hover:shadow-primary-500/20 overflow-hidden rounded-xl bg-white/5 p-3 shadow-lg transition-all duration-300">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${doc.url}&sz=128`}
                        alt="Document icon"
                        className="h-16 w-16 object-contain transition-all duration-300 group-hover:scale-110"
                      />
                    </div>
                  </a>
                  {editingDocId === doc.url ? (
                    <div className="mt-4 flex flex-col gap-2">
                      <input
                        type="text"
                        value={editDocFormData.title}
                        onChange={(e) =>
                          setEditDocFormData({
                            ...editDocFormData,
                            title: e.target.value,
                          })
                        }
                        className="bg-footer-800 ring-primary-500 rounded-lg px-4 py-2 text-white transition-all duration-200 outline-none focus:ring-2"
                      />
                      <input
                        type="text"
                        value={editDocFormData.url}
                        onChange={(e) =>
                          setEditDocFormData({
                            ...editDocFormData,
                            url: e.target.value,
                          })
                        }
                        className="bg-footer-800 ring-primary-500 rounded-lg px-4 py-2 text-white transition-all duration-200 outline-none focus:ring-2"
                      />
                    </div>
                  ) : (
                    <p className="group-hover:text-primary-500 mt-4 text-center text-lg font-medium text-gray-400 transition-colors">
                      {doc.title}
                    </p>
                  )}
                  {user?.role !== "student" && (
                    <motion.div className="absolute top-2 right-2 flex items-center gap-2">
                      {editingDocId === doc.url ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          className="cursor-pointer rounded-full bg-green-500 p-2 text-white shadow-lg transition-colors duration-200 hover:bg-green-600"
                          onClick={handleSaveDocEdit}
                        >
                          <FaSave />
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          className="bg-primary-700 hover:bg-primary-600 cursor-pointer rounded-full p-2 text-white shadow-lg transition-colors duration-200"
                          onClick={() => handleEditDoc(doc)}
                        >
                          <FaEdit />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        className="cursor-pointer rounded-full bg-red-500 p-2 text-white shadow-lg transition-colors duration-200 hover:bg-red-600"
                        onClick={() => handleDeleteDoc(doc)}
                      >
                        <FaTrash />
                      </motion.button>
                    </motion.div>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default VideoContent;
