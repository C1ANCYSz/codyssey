import React, { useEffect } from "react";
import { useTranslation } from "../context/TranslationContext";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

function HelpCenter() {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black px-4 py-16 text-white">
      <div className="container mx-auto max-w-5xl space-y-12">
        <h1 className="text-4xl font-bold text-white">{t("help_center")}</h1>

        {/* Introduction */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {t("what_is_codyssey")}
          </h2>
          <p className="text-gray-300">{t("codyssey_description")}</p>
        </section>

        {/* How it works */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {t("how_platform_works")}
          </h2>
          <ul className="list-disc space-y-3 pl-6 text-gray-300">
            <li>
              <strong>{t("custom_roadmaps")}:</strong>{" "}
              {t("custom_roadmaps_desc")}
            </li>
            <li>
              <strong>{t("step_by_step_modules")}:</strong>{" "}
              {t("step_by_step_modules_desc")}
            </li>
            <li>
              <strong>{t("progress_tracking")}:</strong>{" "}
              {t("progress_tracking_desc")}
            </li>
            <li>
              <strong>{t("quizzes_projects")}:</strong>{" "}
              {t("quizzes_projects_desc")}
            </li>
            <li>
              <strong>{t("switch_tracks")}:</strong> {t("switch_tracks_desc")}
            </li>
          </ul>
        </section>

        {/* Additional Features */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {t("additional_features")}
          </h2>
          <ul className="list-disc space-y-3 pl-6 text-gray-300">
            <li>
              <strong>{t("community_features")}:</strong>{" "}
              {t("community_features_desc")}
            </li>
            <li>
              <strong>{t("dark_mode")}:</strong> {t("dark_mode_desc")}
            </li>
            <li>
              <strong>{t("mobile_design")}:</strong> {t("mobile_design_desc")}
            </li>
            <li>
              <strong>{t("multilingual_support")}:</strong>{" "}
              {t("multilingual_support_desc")}
            </li>
          </ul>
        </section>

        {/* Reminder */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">{t("need_more_help")}</h2>
          <p className="text-gray-300">{t("need_more_help_desc")}</p>
        </section>
      </div>
    </div>
  );
}

export default HelpCenter;
