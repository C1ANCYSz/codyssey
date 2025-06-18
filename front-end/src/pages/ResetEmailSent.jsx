import { useEffect } from "react";
import { MdMarkEmailRead } from "react-icons/md";
import { useTranslation } from "../context/TranslationContext";

function ResetEmailSent({ setStep }) {
  const { t } = useTranslation();

  useEffect(() => {
    setStep(2);
  }, [setStep]);

  return (
    <div className="via-primary-600 flex min-h-dvh w-full items-center justify-center bg-gradient-to-br from-blue-950 to-blue-950 p-4 text-center lg:min-h-[calc(100dvh-80px)]">
      <div className="flex w-full max-w-md flex-col rounded-3xl bg-gradient-to-r from-purple-800 to-purple-600 p-1 md:max-w-2xl">
        {/* Top Section */}
        <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 p-6 md:space-y-6 md:p-8">
          <MdMarkEmailRead className="text-9xl text-white" />

          <h1 className="text-2xl font-bold text-white md:text-4xl">
            {t("email_sent_successfully")}
          </h1>
          <p className="text-center text-base text-white md:text-2xl">
            {t("follow_instructions_email")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetEmailSent;
