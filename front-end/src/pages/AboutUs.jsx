import React, { useEffect } from "react";
import { useTranslation } from "../context/TranslationContext";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

function AboutUs() {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is logged in, redirect to dashboard (consistent with other public pages)
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black px-4 py-16 text-white">
      <div className="container mx-auto max-w-5xl space-y-12">
        <h1 className="text-4xl font-bold text-white">{t("about_us_title")}</h1>

        {/* Our Story */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {t("about_story_heading")}
          </h2>
          <p className="mb-2 text-gray-300">{t("about_story_paragraph1")}</p>
          <p className="text-gray-300">{t("about_story_paragraph2")}</p>
        </section>

        {/* Our Mission */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {t("about_mission_heading")}
          </h2>
          <p className="text-gray-300">{t("about_mission_paragraph")}</p>
        </section>

        {/* Our Vision */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {t("about_vision_heading")}
          </h2>
          <p className="text-gray-300">{t("about_vision_paragraph")}</p>
        </section>

        {/* Why Choose Us? / Our Values */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {t("about_why_choose_heading")}
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-gray-300">
            <li>
              <strong>{t("about_value1_title")}:</strong>{" "}
              {t("about_value1_desc")}
            </li>
            <li>
              <strong>{t("about_value2_title")}:</strong>{" "}
              {t("about_value2_desc")}
            </li>
            <li>
              <strong>{t("about_value3_title")}:</strong>{" "}
              {t("about_value3_desc")}
            </li>
          </ul>
        </section>

        {/* Team (Optional - just placeholder) */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {t("about_team_heading")}
          </h2>
          <p className="text-gray-300">{t("about_team_paragraph")}</p>
        </section>
      </div>
    </div>
  );
}

export default AboutUs;
