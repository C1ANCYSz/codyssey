import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { useGetStage } from "../../hooks/courses/useGetStage";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PiCheckBold,
  PiCheckCircleFill,
  PiPlusBold,
  PiXCircleFill,
} from "react-icons/pi";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthProvider";
import { useUpdateStageContent } from "../../hooks/user/content-manager/useUpdateStageContent";
import { useUpdateStageProgress } from "../../hooks/user/useUpdateStageProgress";
import { useGetStudent } from "../../hooks/user/useGetStudent";
import { toast } from "react-hot-toast";
import { useTranslation } from "../../context/TranslationContext";

function ManageQuiz({ stage }) {
  const { register, handleSubmit, reset } = useForm();
  const [newQuestions, setNewQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const { t } = useTranslation();

  const { updateStageContent, isLoading: isUpdatingContent } =
    useUpdateStageContent();

  const handleAddQuestion = () => {
    setNewQuestions((current) => [...current, { question: "", options: [] }]);
  };

  const onSubmit = (data) => {
    console.log(data);
    console.log(stage);
    const updatedQuestions = {
      questions: [
        ...stage.questions,
        ...data.questions.map((question) => ({
          questionText: question.questionText,
          options: question.options.map((option, index) => ({
            answer: option.answer,
            isCorrect: index === Number(question.correctOption),
          })),
        })),
      ],
    };
    updatedQuestions.questionsCount = updatedQuestions.questions.length;
    updateStageContent(
      { stageId: stage._id, data: updatedQuestions },
      {
        onSuccess: () => {
          reset();
          setNewQuestions([]);
        },
      },
    );
  };

  const submitEditedQuestion = (data) => {
    const editedQuestionIndex = stage.questions.findIndex(
      (q) => q._id === editingQuestion._id,
    );

    const updatedQuestion = {
      _id: editingQuestion._id,
      questionText: data.questions[editedQuestionIndex].questionText,
      options: data.questions[editedQuestionIndex].options.map(
        (option, index) => ({
          answer: option.answer,
          isCorrect:
            index === Number(data.questions[editedQuestionIndex].correctOption),
        }),
      ),
    };

    const updatedQuestions = {
      questions: [
        ...stage.questions.slice(0, editedQuestionIndex),
        updatedQuestion,
        ...stage.questions.slice(editedQuestionIndex + 1),
      ],
      questionsCount: stage.questions.length,
    };

    updateStageContent(
      { stageId: stage._id, data: updatedQuestions },
      {
        onSuccess: () => {
          setEditingQuestion(null);
        },
      },
    );
  };

  function handleDeleteQuestion(questionId) {
    const updatedQuestions = {
      questions: stage.questions.filter((q) => q._id !== questionId),
      questionsCount: stage.questions.length - 1,
    };
    updateStageContent(
      { stageId: stage._id, data: updatedQuestions },
      {
        onSuccess: () => {
          setEditingQuestion(null);
        },
      },
    );
  }

  function handleEditQuestion(question) {
    setEditingQuestion(question);
  }

  return (
    <main className="mx-auto mt-12 flex max-w-7xl flex-col gap-8 px-4 lg:flex-row">
      <div className="flex-1">
        <div className="sticky top-8">
          <h2 className="mb-8 flex items-center gap-3 text-3xl font-bold text-white">
            <span className="from-primary-500 to-primary-600 bg-gradient-to-r bg-clip-text text-transparent">
              {t("questions")}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-lg">
              {stage.questions.length}
            </span>
          </h2>
          <div className="space-y-6">
            {stage.questions.map((question, index) => (
              <div
                key={question._id}
                className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 shadow-xl backdrop-blur-xl transition-all hover:border-white/20"
              >
                {editingQuestion === question ? (
                  <form
                    onSubmit={handleSubmit(submitEditedQuestion)}
                    className="space-y-6"
                  >
                    <div>
                      <input
                        type="text"
                        defaultValue={editingQuestion?.questionText}
                        {...register(`questions.${index}.questionText`)}
                        className="focus:ring-primary-500 w-full rounded-xl border-0 bg-white/5 p-4 text-white placeholder-white/40 ring-1 ring-white/10 transition-all focus:ring-2"
                        placeholder={t("enter_question_text")}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {[0, 1, 2, 3].map((optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center gap-3 rounded-xl bg-white/5 p-4 ring-1 ring-white/10"
                        >
                          <input
                            type="text"
                            placeholder={`${t("option")} ${optionIndex + 1}`}
                            defaultValue={
                              editingQuestion?.options[optionIndex]?.answer
                            }
                            {...register(
                              `questions.${index}.options.${optionIndex}.answer`,
                            )}
                            className="flex-1 rounded-lg border-0 bg-transparent p-2 text-white placeholder-white/40 ring-0 focus:ring-0"
                          />
                          <label className="flex cursor-pointer items-center gap-2">
                            <input
                              type="radio"
                              {...register(`questions.${index}.correctOption`)}
                              value={optionIndex}
                              defaultChecked={
                                editingQuestion?.options[optionIndex]?.isCorrect
                              }
                              className="accent-primary-500 h-5 w-5"
                            />
                            <span className="text-sm text-white/60">
                              {t("correct")}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingQuestion(null)}
                        className="rounded-xl border border-white/10 px-6 py-2.5 text-white/80 transition-all hover:bg-white/5"
                      >
                        {t("cancel")}
                      </button>
                      <button
                        type="submit"
                        className="from-primary-600 to-primary-500 shadow-primary-500/25 hover:shadow-primary-500/40 flex items-center gap-2 rounded-xl bg-gradient-to-r px-6 py-2.5 font-medium text-white shadow-lg transition-all"
                      >
                        <PiCheckBold className="h-5 w-5" />
                        {t("save_changes")}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-medium text-white">
                          {index + 1}
                        </span>
                        <h3 className="text-xl font-medium text-white">
                          {question.questionText}
                        </h3>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {question.options.map((option, idx) => (
                          <div
                            key={idx}
                            className={`rounded-xl p-4 transition-all ${
                              option.isCorrect
                                ? "bg-gradient-to-r from-green-500/20 to-green-600/20 ring-1 ring-green-500/30"
                                : "bg-white/5"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {option.isCorrect && (
                                <PiCheckCircleFill className="h-5 w-5 text-green-500" />
                              )}
                              <span className="text-white/90">
                                {option.answer}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => handleEditQuestion(question)}
                        className="hover:text-primary-400 rounded-xl bg-white/5 p-3 text-white/60 transition-all hover:bg-white/10"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button
                        className="rounded-xl bg-white/5 p-3 text-white/60 transition-all hover:bg-white/10 hover:text-red-400"
                        onClick={() => handleDeleteQuestion(question._id)}
                      >
                        <PiXCircleFill className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:w-[400px]">
        <div className="sticky top-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">
              {t("add_question")}
            </h2>
            <button
              className="from-primary-600 to-primary-500 shadow-primary-500/25 hover:shadow-primary-500/40 rounded-xl bg-gradient-to-r p-3 text-white shadow-lg transition-all"
              onClick={handleAddQuestion}
            >
              <PiPlusBold className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {newQuestions.map((question, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 shadow-xl backdrop-blur-xl"
              >
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor={`question-${index}`}
                      className="mb-2 block text-sm font-medium text-white/60"
                    >
                      {t("questions")} {index + 1}
                    </label>
                    <input
                      {...register(`questions.${index}.questionText`)}
                      type="text"
                      id={`question-${index}`}
                      className="focus:ring-primary-500 w-full rounded-xl border-0 bg-white/5 p-4 text-white placeholder-white/40 ring-1 ring-white/10 transition-all focus:ring-2"
                      placeholder={t("enter_question_text")}
                    />
                  </div>

                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((optionNum) => (
                      <div
                        key={optionNum}
                        className="flex items-center gap-3 rounded-xl bg-white/5 p-4 ring-1 ring-white/10"
                      >
                        <input
                          {...register(
                            `questions.${index}.options.${optionNum - 1}.answer`,
                          )}
                          type="text"
                          placeholder={`${t("option")} ${optionNum}`}
                          className="flex-1 rounded-lg border-0 bg-transparent p-2 text-white placeholder-white/40 ring-0 focus:ring-0"
                        />
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            {...register(`questions.${index}.correctOption`)}
                            value={optionNum - 1}
                            className="accent-primary-500 h-5 w-5"
                          />
                          <span className="text-sm text-white/60">
                            {t("correct")}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {newQuestions.length > 0 && (
              <button
                type="submit"
                className="from-primary-600 to-primary-500 shadow-primary-500/25 hover:shadow-primary-500/40 w-full rounded-xl bg-gradient-to-r px-6 py-3 font-medium text-white shadow-lg transition-all"
                disabled={isUpdatingContent}
              >
                {isUpdatingContent ? t("saving") : t("save")}
              </button>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}

function QuizContent({ stage, roadmapId }) {
  const { questions, questionsCount = questions.length, number } = stage ?? {};
  console.log(stage);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateStageProgress, isLoading } = useUpdateStageProgress();
  const { studentData, isLoading: isGettingStudent } = useGetStudent();
  const { t } = useTranslation();
  const [quizState, setQuizState] = useState({
    selectedQuestion: null,
    score: 0,
    isCompleted: false,
    isStarted: false,
    isLastQuestion: false,
    currentAnswer: null,
  });

  const isPassed = quizState.score / questionsCount >= 0.7;

  const handleOptionClick = (option) => {
    if (quizState.currentAnswer !== null) return;

    setQuizState((prev) => ({
      ...prev,
      currentAnswer: option,
      score: option.isCorrect ? prev.score + 1 : prev.score,
    }));
  };

  const handleNextQuestion = () => {
    if (quizState.currentAnswer === null) return;

    const nextQuestionIndex = questions.indexOf(quizState.selectedQuestion) + 1;
    const isLastQuestion = nextQuestionIndex === questions.length - 1;

    if (nextQuestionIndex === questions.length) {
      setQuizState((prev) => ({
        ...prev,
        isCompleted: true,
      }));
      return;
    }

    setQuizState((prev) => ({
      ...prev,
      selectedQuestion: questions[nextQuestionIndex],
      currentAnswer: null,
      isLastQuestion,
    }));
  };

  const handleRetakeQuiz = () => {
    setQuizState({
      selectedQuestion: null,
      score: 0,
      isCompleted: false,
      isStarted: false,
      isLastQuestion: false,
      currentAnswer: null,
    });
  };

  const handleNextStage = () => {
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
  };

  const startQuiz = () => {
    setQuizState((prev) => ({
      ...prev,
      isStarted: true,
      selectedQuestion: questions[0],
    }));
  };

  return (
    <main className="mx-auto mt-12 max-w-4xl px-4">
      <div className="flex items-center justify-between">
        <h2 className="from-primary-500 to-primary-600 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent">
          {t("questions")}
        </h2>
        {quizState.isStarted && !quizState.isCompleted && (
          <div className="flex items-center gap-3 rounded-full bg-white/5 px-6 py-3 ring-1 ring-white/10 backdrop-blur-md">
            <span className="text-primary-500 text-2xl font-bold">
              {questions.indexOf(quizState.selectedQuestion) + 1}
            </span>
            <span className="text-xl text-white/60">/ {questionsCount}</span>
          </div>
        )}
      </div>

      <section className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 shadow-xl backdrop-blur-xl">
        {!quizState.isStarted && (
          <div className="space-y-8 text-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white">
                {t("questions")} {t("overview")}
              </h3>
              <div className="space-y-6">
                <div className="flex justify-center gap-8">
                  <div className="rounded-xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-md">
                    <p className="text-sm text-white/60">{t("time_limit")}</p>
                    <p className="from-primary-500 to-primary-600 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
                      15 {t("minutes")}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-md">
                    <p className="text-sm text-white/60">{t("questions")}</p>
                    <p className="from-primary-500 to-primary-600 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
                      {questionsCount}
                    </p>
                  </div>
                </div>
                <p className="text-white/60">
                  {t("complete_all_questions_within_time_limit")}{" "}
                  {t("you_need_70_percent_to_pass")}
                </p>
              </div>
            </div>
            <button
              onClick={startQuiz}
              className="from-primary-600 to-primary-500 shadow-primary-500/25 hover:shadow-primary-500/40 rounded-xl bg-gradient-to-r px-10 py-4 text-lg font-medium text-white shadow-lg transition-all"
            >
              {t("start_quiz")}
            </button>
          </div>
        )}

        {quizState.isStarted && !quizState.isCompleted && (
          <div className="space-y-8">
            <h3 className="text-center text-2xl font-bold text-white">
              {quizState.selectedQuestion?.questionText}
            </h3>
            <div className="space-y-4">
              {quizState.selectedQuestion?.options.map((option) => (
                <button
                  disabled={quizState.currentAnswer !== null}
                  key={option.answer}
                  onClick={() => handleOptionClick(option)}
                  className={`group relative w-full overflow-hidden rounded-xl p-6 text-left transition-all ${
                    quizState.currentAnswer === option
                      ? option.isCorrect
                        ? "bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 ring-1 ring-green-500/30"
                        : "bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 ring-1 ring-red-500/30"
                      : quizState.currentAnswer !== null && option.isCorrect
                        ? "bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 ring-1 ring-green-500/30"
                        : "bg-white/5 text-white ring-1 ring-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="relative z-10 text-lg font-medium">
                    {option.answer}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                disabled={quizState.currentAnswer === null}
                className={`rounded-xl px-10 py-4 text-lg font-medium transition-all ${
                  quizState.currentAnswer === null
                    ? "cursor-not-allowed bg-white/5 text-white/40"
                    : "from-primary-600 to-primary-500 shadow-primary-500/25 hover:shadow-primary-500/40 bg-gradient-to-r text-white shadow-lg"
                }`}
                onClick={handleNextQuestion}
              >
                {quizState.isLastQuestion ? t("finish") : t("next_question")}
              </button>
            </div>
          </div>
        )}

        {quizState.isCompleted && (
          <div className="space-y-8 text-center">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-white">
                {t("quiz_completed")}
              </h3>
              <div className="inline-flex items-center gap-3 rounded-full bg-white/5 px-6 py-3 ring-1 ring-white/10">
                <span className="text-primary-500 text-2xl font-bold">
                  {quizState.score}
                </span>
                <span className="text-white/60">/ {questionsCount}</span>
                <span className="text-lg text-white/60">
                  ({Math.round((quizState.score / questionsCount) * 100)}%)
                </span>
              </div>
            </div>

            <div
              className={`flex flex-col items-center gap-4 ${
                isPassed ? "text-green-400" : "text-red-400"
              }`}
            >
              <h4 className="text-2xl font-bold">
                {isPassed ? t("congratulations") : t("try_again")}
              </h4>
              <p className="text-lg">
                {isPassed ? t("you_passed") : t("you_failed")}
              </p>
            </div>

            <div className="flex justify-center gap-4">
              {!isPassed && (
                <button
                  onClick={handleRetakeQuiz}
                  className="rounded-xl border border-white/10 px-8 py-3 text-white transition-all hover:bg-white/5"
                >
                  {t("retake_quiz")}
                </button>
              )}
              {isPassed && (
                <button
                  onClick={handleNextStage}
                  className="from-primary-600 to-primary-500 shadow-primary-500/25 hover:shadow-primary-500/40 rounded-xl bg-gradient-to-r px-8 py-3 font-medium text-white shadow-lg transition-all"
                >
                  {t("next_stage")}
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

const Quiz = () => {
  const { user } = useAuth();
  const { register, handleSubmit } = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const { updateStageContent, isLoading: isUpdatingContent } =
    useUpdateStageContent();
  const { stage: { stage } = {}, isLoading } = useGetStage();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    description,
    title,
    roadmap: roadmapId,

    number,
    type,
    _id: stageId,
  } = stage ?? {};
  console.log(stage);
  function handleEditQuizInfo(data) {
    const { title, description } = data;
    const newNumber = Number(data.number);

    updateStageContent(
      {
        stageId,
        data: {
          ...stage,
          title,
          description,
          number: newNumber,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          navigate(`/roadmaps/${roadmapId}/stage/${newNumber}`, {
            replace: true,
          });
        },
        onError: (error) => {
          console.error("Error updating stage:", error);
          toast.error("Failed to update stage information");
        },
      },
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="border-primary-500 h-16 w-16 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/roadmaps/${roadmapId}`)}
            className="group flex items-center gap-3 rounded-xl bg-white/5 px-6 py-3 text-lg font-medium text-white ring-1 ring-white/10 backdrop-blur-md transition-all hover:bg-white/10"
          >
            <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
            <span>{t("back_to_roadmap")}</span>
          </button>
        </nav>

        <header className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 rounded-full bg-white/5 p-2 ring-1 ring-white/10 backdrop-blur-md">
            <span className="from-primary-600 to-primary-500 rounded-full bg-gradient-to-r px-4 py-2 text-sm font-medium text-white">
              {type}
            </span>
            {isEditing ? (
              <input
                type="text"
                defaultValue={title}
                placeholder="Enter title..."
                className="w-full rounded-xl border-0 p-4 text-white placeholder-white/40 transition-all outline-none"
                {...register("title", {
                  required: { value: true, message: "Title is required" },
                })}
              />
            ) : (
              <h1 className="pr-4 text-2xl font-bold text-white">{title}</h1>
            )}
            <button
              className="cursor-pointer rounded-full bg-emerald-600 px-5 py-3 text-white transition-all duration-200 hover:bg-emerald-700"
              onClick={() => {
                if (!isEditing) setIsEditing(true);
                if (isEditing) {
                  handleSubmit(handleEditQuizInfo)();
                }
              }}
            >
              {isEditing ? "Done" : "Edit"}
            </button>
          </div>
          {isEditing ? (
            <motion.div
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 flex flex-col items-center gap-3"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4"
              >
                <label htmlFor="stage" className="w-33 text-start text-white">
                  Quiz Description:
                </label>
                <textarea
                  rows={2}
                  defaultValue={description}
                  className="bg-footer-800/50 rounded-lg border border-gray-400 px-4 py-2 text-white outline-none"
                  {...register("description", {
                    required: {
                      value: true,
                      message: "Description is required",
                    },
                  })}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="-ml-35 flex items-center gap-4"
              >
                <label htmlFor="stage" className="w-32 text-start text-white">
                  Stage Number:
                </label>
                <input
                  type="number"
                  defaultValue={number}
                  className="bg-footer-800/50 w-16 rounded-lg border border-gray-400 px-2 py-2 text-center text-white outline-none"
                  {...register("number", {
                    required: {
                      value: true,
                      message: "Stage number is required",
                    },
                    min: {
                      value: 1,
                      message: "Stage number must be at least 1",
                    },
                  })}
                />
              </motion.div>
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-6 text-lg text-white/60"
            >
              {stage?.description}
            </motion.p>
          )}
        </header>

        {user.role === "content manager" && (
          <ManageQuiz user={user} stage={stage} />
        )}

        {user.role === "student" && (
          <QuizContent stage={stage} roadmapId={roadmapId} />
        )}
      </div>
    </div>
  );
};

export default Quiz;
