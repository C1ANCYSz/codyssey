import React, { useEffect } from "react";
import { useTranslation } from "../context/TranslationContext";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

function PrivacyPolicy() {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
   
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="via-primary-800 from-primary-900 to-slate-950 bg-gradient-to-br text-white min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-5xl space-y-12">
        <h1 className="text-4xl font-bold text-white">{t("privacy_policy_title")}</h1>

        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t("privacy_introduction_heading")}</h2>
          <p className="text-gray-300 mb-2">
            {t("privacy_introduction_paragraph1")}
          </p>
          <p className="text-gray-300">
            {t("privacy_introduction_paragraph2")}
          </p>
        </section>

        {/* Information We Collect */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t("privacy_info_collect_heading")}</h2>
          <p className="text-gray-300 mb-2">
            {t("privacy_info_collect_paragraph1")}
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li><strong>{t("privacy_info_collect_item1_title")}:</strong> {t("privacy_info_collect_item1_desc")}</li>
            <li><strong>{t("privacy_info_collect_item2_title")}:</strong> {t("privacy_info_collect_item2_desc")}</li>
            <li><strong>{t("privacy_info_collect_item3_title")}:</strong> {t("privacy_info_collect_item3_desc")}</li>
          </ul>
        </section>

        {/* How We Use Your Information */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t("privacy_how_use_info_heading")}</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>{t("privacy_how_use_info_item1")}</li>
            <li>{t("privacy_how_use_info_item2")}</li>
            <li>{t("privacy_how_use_info_item3")}</li>
            <li>{t("privacy_how_use_info_item4")}</li>
          </ul>
        </section>

        {/* Sharing Your Information */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t("privacy_sharing_info_heading")}</h2>
          <p className="text-gray-300">
            {t("privacy_sharing_info_paragraph")}
          </p>
        </section>

        {/* Data Security */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t("privacy_data_security_heading")}</h2>
          <p className="text-gray-300">
            {t("privacy_data_security_paragraph")}
          </p>
        </section>

        {/* Your Rights */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t("privacy_your_rights_heading")}</h2>
          <p className="text-gray-300">
            {t("privacy_your_rights_paragraph")}
          </p>
        </section>

        {/* Changes to This Policy */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t("privacy_changes_heading")}</h2>
          <p className="text-gray-300">
            {t("privacy_changes_paragraph")}
          </p>
        </section>

        {/* Contact Us */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t("privacy_contact_heading")}</h2>
          <p className="text-gray-300">
            {t("privacy_contact_paragraph")}
          </p>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPolicy;