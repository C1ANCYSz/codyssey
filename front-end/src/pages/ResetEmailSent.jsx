import { useEffect } from "react";
import { MdMarkEmailRead } from "react-icons/md";
import { useTranslation } from "../context/TranslationContext";

function ResetEmailSent({ setStep }) {
  const { t } = useTranslation();

  useEffect(() => {
    setStep(2);
  }, [setStep]);

  return (
    <div className="from-primary-800 flex min-h-dvh w-full items-center justify-center bg-gradient-to-br to-black p-4 text-center lg:min-h-[calc(100dvh-80px)]">
      <div className="flex w-full max-w-md flex-col rounded-3xl border-1 border-white/30 bg-gray-900/40 p-1 md:max-w-2xl">
        {/* Top Section */}
        <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl bg-gray-900/40 p-6 md:space-y-6 md:p-8">
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
