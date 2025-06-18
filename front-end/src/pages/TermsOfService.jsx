import React, { useEffect } from "react";
import { useTranslation } from "../context/TranslationContext";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

function TermsOfService() {
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
          {t("terms_of_service_title")}
        </h1>

        {/* Introduction */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {t("terms_introduction_heading")}
          </h2>
          <p className="mb-2 text-gray-300">
            {t("terms_introduction_paragraph1")}
          </p>
          <p className="text-gray-300">{t("terms_introduction_paragraph2")}</p>
        </section>

        {/* User Obligations */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {t("terms_obligations_heading")}
          </h2>
          <p className="mb-2 text-gray-300">
            {t("terms_obligations_paragraph1")}
          </p>
          <ul className="list-disc space-y-2 pl-6 text-gray-300">
            <li>{t("terms_obligations_item1")}</li>
            <li>{t("terms_obligations_item2")}</li>
            <li>{t("terms_obligations_item3")}</li>
            <li>{t("terms_obligations_item4")}</li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {t("terms_intellectual_property_heading")}
          </h2>
          <p className="text-gray-300">
            {t("terms_intellectual_property_paragraph")}
          </p>
        </section>

        {/* Termination */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {t("terms_termination_heading")}
          </h2>
          <p className="text-gray-300">{t("terms_termination_paragraph")}</p>
        </section>

        {/* Disclaimer */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {t("terms_disclaimer_heading")}
          </h2>
          <p className="text-gray-300">{t("terms_disclaimer_paragraph")}</p>
        </section>

        {/* Governing Law */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {t("terms_governing_law_heading")}
          </h2>
          <p className="text-gray-300">{t("terms_governing_law_paragraph")}</p>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {t("terms_contact_heading")}
          </h2>
          <p className="text-gray-300">{t("terms_contact_paragraph")}</p>
        </section>
      </div>
    </div>
  );
}

export default TermsOfService;
