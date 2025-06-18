import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useVerifyEmail } from "../hooks/auth/useVerifyEmail";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { useTranslation } from "../context/TranslationContext";

// Add this helper function at the top of your file
const mergeRefs = (...refs) => {
  return (element) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(element);
      } else if (ref != null) {
        ref.current = element;
      }
    });
  };
};

function VerifyEmail() {
  const { verifyEmail: verifyUserEmail, isLoading } = useVerifyEmail();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange", // This will enable real-time validation
  });

  const inputRefs = {
    code1: useRef(null),
    code2: useRef(null),
    code3: useRef(null),
    code4: useRef(null),
    code5: useRef(null),
    code6: useRef(null),
  };

  const handleCodeChange = (e, currentField) => {
    const value = e.target.value;

    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      e.target.value = "";
      return;
    }

    const fields = ["code1", "code2", "code3", "code4", "code5", "code6"];
    const currentIndex = fields.indexOf(currentField);

    if (value.length === 1) {
      if (currentIndex < fields.length - 1) {
        inputRefs[fields[currentIndex + 1]].current.focus();
      }
    }

    if (value.length === 0 && currentIndex > 0) {
      inputRefs[fields[currentIndex - 1]].current.focus();
    }
  };

  function onSubmit(data) {
    const verificationCode = Object.keys(data)
      .filter((key) => key.startsWith("code"))
      .map((key) => data[key])
      .join("");

    console.log(verificationCode);
    verifyUserEmail(verificationCode);
  }

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4 text-center lg:min-h-screen">
      <div className="flex w-full max-w-md flex-col rounded-3xl bg-gradient-to-br from-gray-900 to-black p-1 md:max-w-2xl">
        {/* Top Section */}
        <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl bg-gray-900 p-6 md:space-y-6 md:p-8">
          <MdOutlineMarkEmailUnread className="text-9xl text-white" />

          <h1 className="text-2xl font-bold text-white md:text-4xl">
            {t("verification_email_sent")}
          </h1>
          <p className="text-center text-base text-white md:text-2xl">
            {t("enter_code_received")}
          </p>
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center space-y-6 rounded-b-3xl bg-white p-6 md:p-10"
        >
          <div className="flex w-full max-w-[400px] items-center justify-between gap-2 px-2 py-2 md:px-4 md:py-3">
            {[1, 2, 3, 4, 5, 6].map((num) => {
              const { ref: registerRef, ...registerProps } = register(
                `code${num}`,
                {
                  required: true,
                  pattern: /^[0-9]$/,
                },
              );

              return (
                <input
                  key={`code${num}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={`h-24 w-1/6 max-w-[93px] rounded-md border-2 px-3 py-2.5 text-center text-3xl transition-all duration-300 outline-none md:px-4 md:py-3 ${errors[`code${num}`] ? "border-red-500" : "focus:border-primary-600"}`}
                  ref={mergeRefs(registerRef, (el) => {
                    inputRefs[`code${num}`].current = el;
                  })}
                  {...registerProps}
                  onChange={(e) => {
                    registerProps.onChange(e); // Call react-hook-form's onChange
                    handleCodeChange(e, `code${num}`); // Call our custom onChange
                  }}
                />
              );
            })}
          </div>

          {Object.keys(errors).length > 0 && (
            <p className="text-sm text-red-500">{t("fill_all_fields_valid")}</p>
          )}

          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 w-full rounded-full px-8 py-2.5 text-sm tracking-wider text-white uppercase transition-all duration-300 md:w-auto md:px-20 md:py-3 md:text-base"
            disabled={isLoading}
          >
            {isLoading ? t("verifying") : t("verify")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyEmail;
