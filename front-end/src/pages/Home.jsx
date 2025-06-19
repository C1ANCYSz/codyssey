import { Link } from "react-router-dom";
import { TbMapRoute } from "react-icons/tb";
import { MdOndemandVideo } from "react-icons/md";
import { FaArrowRight, FaRegUser } from "react-icons/fa";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import { useTranslation } from "../context/TranslationContext";

const Home = () => {
  const { t } = useTranslation();

  // For animated gradient cursor effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  // InView animations
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [tracksRef, tracksInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [ctaRef, ctaInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="fixed top-1/4 -left-64 h-96 w-96 rounded-full bg-indigo-700/10 blur-3xl"></div>
        <div className="fixed -right-64 bottom-1/3 h-96 w-96 rounded-full bg-purple-700/10 blur-3xl"></div>
        <div
          className="fixed h-64 w-64 rounded-full bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 blur-2xl"
          style={{
            left: mousePosition.x - 128,
            top: mousePosition.y - 128,
            transition: "left 0s linear, top 0s ease-out",
          }}
        ></div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] space-y-32 p-4 lg:p-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative min-h-[90vh] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(182,119,198,0.2),rgba(0,0,0,0))]"></div>
          <div className="bg-grid-pattern absolute inset-0 opacity-5"></div>

          <div className="relative flex min-h-[90vh] flex-col items-center justify-center gap-10 px-6 text-center lg:px-20">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-10"
            >
              <motion.h1
                variants={itemVariants}
                className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl"
              >
                {t("master_programming")}
                <span className="relative">
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {" "}
                    {t("the_right_way")}
                  </span>
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="mx-auto max-w-2xl text-xl font-light text-gray-300 md:text-2xl"
              >
                {t("home_hero_description")}
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-6"
              >
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 text-lg font-bold text-white transition-all"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {t("start_learning_now", "Start Learning Now")}
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <FaArrowRight />
                      </motion.span>
                    </span>
                    <div className="absolute inset-0 -z-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 transition-opacity group-hover:opacity-100"></div>
                  </motion.button>
                </Link>
                <Link to="/roadmaps">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl border-2 border-white/30 bg-white/5 px-8 py-4 text-lg font-bold text-white backdrop-blur-lg transition-all hover:bg-white/10"
                  >
                    {t("view_learning_paths", "View Learning Paths")}
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          ref={featuresRef}
          initial={{ opacity: 0 }}
          animate={featuresInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 to-slate-950 py-32 text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(93,63,211,0.2),rgba(0,0,0,0))]"></div>
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              animate={featuresInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center text-4xl font-bold text-white md:text-6xl"
            >
              {t("why_choose_us", "Why Choose Us?")}
            </motion.h2>

            <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: <TbMapRoute className="h-16 w-16" />,
                  title: t("structured_learning", "Structured Learning"),
                  description: t(
                    "structured_learning_desc",
                    "Follow clear, progressive paths to master programming skills",
                  ),
                },
                {
                  icon: <MdOndemandVideo className="h-16 w-16" />,
                  title: t("interactive_content", "Interactive Content"),
                  description: t(
                    "interactive_content_desc",
                    "Learn through engaging videos, quizzes, and coding challenges",
                  ),
                },
                {
                  icon: <FaRegUser className="h-16 w-16" />,
                  title: t("personalized_path", "Personalized Path"),
                  description: t(
                    "personalized_path_desc",
                    "Learn at your own pace with customized learning tracks",
                  ),
                },
                {
                  icon: <LiaChalkboardTeacherSolid className="h-16 w-16" />,
                  title: t("expert_support", "Expert Support"),
                  description: t(
                    "expert_support_desc",
                    "Get help from experienced developers when stuck",
                  ),
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  animate={featuresInView ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                  whileHover={{
                    y: -8,
                  }}
                  className="group flex flex-col items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all select-none hover:bg-white/10"
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={featuresInView ? { scale: 1 } : {}}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 12,
                    }}
                    className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-lg shadow-indigo-500/20"
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-center text-lg text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Learning Tracks */}
        <motion.div
          ref={tracksRef}
          initial={{ opacity: 0 }}
          animate={tracksInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 to-slate-950 py-32"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(93,63,211,0.2),rgba(0,0,0,0))]"></div>
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              animate={tracksInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center text-4xl font-bold text-white md:text-6xl"
            >
              {t("popular_learning_tracks", "Popular Learning Tracks")}
            </motion.h2>

            <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: t("frontend_development", "Frontend Development"),
                  description: t(
                    "frontend_development_desc",
                    "Master modern web development with React, Vue & more",
                  ),
                  level: t("beginner_friendly", "Beginner Friendly"),
                  icon: "🌐",
                },
                {
                  title: t("backend_development", "Backend Development"),
                  description: t(
                    "backend_development_desc",
                    "Build scalable servers & APIs with Node.js",
                  ),
                  level: t("intermediate", "Intermediate"),
                  icon: "⚙️",
                },
                {
                  title: t("fullstack_development", "Full Stack Development"),
                  description: t(
                    "fullstack_development_desc",
                    "Become a complete web developer",
                  ),
                  level: t("advanced", "Advanced"),
                  icon: "🚀",
                },
              ].map((track, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  animate={tracksInView ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-8 transition-all hover:border-indigo-500/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                  <span className="mb-4 inline-block text-4xl">
                    {track.icon}
                  </span>
                  <h3 className="text-2xl font-bold text-white transition-colors group-hover:text-indigo-300">
                    {track.title}
                  </h3>
                  <p className="mt-4 text-gray-300">{track.description}</p>
                  <span className="mt-4 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/20 px-4 py-1 text-sm text-indigo-200">
                    {track.level}
                  </span>
                  <motion.div
                    className="mt-6 flex items-center gap-2 text-indigo-300 opacity-0 transition-opacity group-hover:opacity-100"
                    initial={{ x: -10 }}
                    whileHover={{ x: 0 }}
                  >
                    <span>{t("explore_track", "Explore track")}</span>
                    <FaArrowRight className="transition-transform group-hover:translate-x-2" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0 }}
          animate={ctaInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-900 to-purple-900 py-24"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),rgba(0,0,0,0))]"></div>

          <div className="relative z-10 flex flex-col items-center gap-12">
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              animate={ctaInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-3xl text-center text-3xl font-bold text-white md:text-5xl"
            >
              {t("ready_to_begin", "Ready to Begin Your Coding Journey?")}
            </motion.h2>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={ctaInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative overflow-hidden rounded-full bg-white px-8 py-4 text-xl font-bold text-indigo-900 transition-all"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {t("get_started_for_free", "Get Started For Free")}
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <FaArrowRight />
                    </motion.span>
                  </span>
                  <motion.div
                    className="absolute inset-0 -z-0 bg-gradient-to-r from-indigo-100 to-purple-100 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  ></motion.div>
                </motion.button>
              </Link>
            </motion.div>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={ctaInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center text-white/70"
            >
              {t(
                "join_10000_devs",
                "Join 10,000+ developers who have already started their journey",
              )}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
