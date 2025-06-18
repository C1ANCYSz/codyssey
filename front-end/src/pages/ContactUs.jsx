import React, { useEffect } from "react";
import { useTranslation } from "../context/TranslationContext";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

function ContactUs() {
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
        <h1 className="text-4xl font-bold text-white">
          {t("contact_us_title")}
        </h1>

        {/* Introduction */}
        <section>
          <p className="mb-6 text-gray-300">
            {t("contact_introduction_paragraph")}
          </p>
        </section>

        {/* General Inquiries */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {t("contact_general_inquiries_heading")}
          </h2>
          <p className="mb-2 text-gray-300">
            {t("contact_general_inquiries_paragraph")}
          </p>
          <p className="text-gray-300">
            <strong>{t("contact_email_label")}:</strong>{" "}
            <a
              href="mailto:info@codyssey.com"
              className="text-blue-400 hover:underline"
            >
              info@codyssey.com
            </a>
          </p>
        </section>

        {/* Technical Support */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {t("contact_technical_support_heading")}
          </h2>
          <p className="mb-2 text-gray-300">
            {t("contact_technical_support_paragraph")}
          </p>
          <p className="text-gray-300">
            <strong>{t("contact_email_label")}:</strong>{" "}
            <a
              href="mailto:support@codyssey.com"
              className="text-blue-400 hover:underline"
            >
              support@codyssey.com
            </a>
          </p>
        </section>

        {/* Partnerships & Collaborations */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {t("contact_partnerships_heading")}
          </h2>
          <p className="mb-2 text-gray-300">
            {t("contact_partnerships_paragraph")}
          </p>
          <p className="text-gray-300">
            <strong>{t("contact_email_label")}:</strong>{" "}
            <a
              href="mailto:partnerships@codyssey.com"
              className="text-blue-400 hover:underline"
            >
              partnerships@codyssey.com
            </a>
          </p>
        </section>

        {/* Social Media (Optional) */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {t("contact_social_media_heading")}
          </h2>
          <p className="mb-2 text-gray-300">
            {t("contact_social_media_paragraph")}
          </p>
          <div className="flex space-x-4">
            {/* Replace with actual social media icons/links if available */}
            <a href="#" className="text-blue-400 hover:underline">
              {t("contact_facebook")}
            </a>
            <a href="#" className="text-blue-400 hover:underline">
              {t("contact_twitter")}
            </a>
            <a href="#" className="text-blue-400 hover:underline">
              {t("contact_linkedin")}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ContactUs;
