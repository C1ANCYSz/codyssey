import { useForm } from "react-hook-form";
import { MdOutlineEmail } from "react-icons/md";
import { useForgotPassword } from "../hooks/auth/useForgotPassword";
import { useTranslation } from "../context/TranslationContext";

function EmailForm({ setStep }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { forgotPassword, isLoading, error } = useForgotPassword();
  const { t } = useTranslation();

  function onSubmit(data) {
    forgotPassword({ email: data.email, setStep });
  }
  return (
    <div className="via-primary-600 flex min-h-dvh w-full items-center justify-center bg-gradient-to-br from-blue-950 to-blue-950 p-4 text-center lg:min-h-[calc(100dvh-80px)]">
      <div className="flex w-full max-w-md flex-col rounded-3xl bg-gradient-to-r from-purple-800 to-purple-600 p-1 md:max-w-2xl">
        {/* Top Section */}
        <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 p-6 md:space-y-6 md:p-8">
          <img
            src="/src/assets/images/locker.png"
            alt="locker"
            className="h-[120px] w-auto object-cover md:h-[200px]"
          />
          <h1 className="text-2xl font-bold text-white md:text-4xl">
            {t("forgot_password_title")}
          </h1>
          <p className="text-center text-base text-white md:text-2xl">
            {t("provide_account_email")}
          </p>
        </div>

        {/* Form Section */}
        <form
          className="flex flex-col items-center justify-between space-y-4 rounded-b-3xl bg-white p-6 md:space-y-8 md:p-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="group relative flex w-full items-center gap-2 rounded-md border-2 px-2">
            <input
              type="email"
              placeholder={t("email")}
              className="focus:border-primary-600 w-full py-2.5 transition-all duration-300 outline-none md:px-4 md:py-3"
              {...register("email", { required: true })}
            />
            <MdOutlineEmail className="group-focus-within:text-primary-600 text-xl text-black transition-colors duration-300 md:right-8 md:text-2xl" />
          </div>

          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 w-full cursor-pointer rounded-full px-8 py-2.5 text-sm tracking-wider text-white uppercase transition-all duration-300 md:w-auto md:px-20 md:py-3 md:text-base"
          >
            {t("next")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EmailForm;
