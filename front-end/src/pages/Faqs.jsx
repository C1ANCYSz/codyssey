import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../context/TranslationContext"; // Import useTranslation

function Faqs() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize the t function

  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Define FAQs using translation keys
  const faqs = [
    {
      questionKey: "faq_what_is_codyssey_q",
      answerKey: "faq_what_is_codyssey_a",
    },
    {
      questionKey: "faq_is_codyssey_free_q",
      answerKey: "faq_is_codyssey_free_a",
    },
    {
      questionKey: "faq_how_create_account_q",
      answerKey: "faq_how_create_account_a",
    },
    {
      questionKey: "faq_use_without_login_q",
      answerKey: "faq_use_without_login_a",
    },
    {
      questionKey: "faq_how_roadmaps_generated_q",
      answerKey: "faq_how_roadmaps_generated_a",
    },
    {
      questionKey: "faq_switch_tracks_q",
      answerKey: "faq_switch_tracks_a",
    },
    {
      questionKey: "faq_how_appointments_work_q",
      answerKey: "faq_how_appointments_work_a",
    },
    {
      questionKey: "faq_data_secure_q",
      answerKey: "faq_data_secure_a",
    },
    {
      questionKey: "faq_forgot_password_q",
      answerKey: "faq_forgot_password_a",
    },
    {
      questionKey: "faq_no_verification_email_q",
      answerKey: "faq_no_verification_email_a",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black px-4 py-16 text-white">
      <div className="container mx-auto max-w-4xl">
        {/* Apply t function to the main title */}
        <h1 className="mb-10 text-4xl font-bold">{t("faq_page_title")}</h1>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-600 pb-4">
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full text-left text-xl font-semibold focus:outline-none"
              >
                {/* Apply t function to each question */}
                {t(faq.questionKey)}
              </button>
              {activeIndex === index && (
                <p className="mt-2 text-gray-300">
                  {/* Apply t function to each answer */}
                  {t(faq.answerKey)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Faqs;
