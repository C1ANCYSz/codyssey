import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthProvider";
import { useLogin } from "../hooks/auth/useLogin";
import { useTranslation } from "../context/TranslationContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const { isLoggedIn } = useAuth();

  const { login } = useLogin();

  // استخدم دالة الترجمة t من السياق
  const { t } = useTranslation();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  function onSubmit(data) {
    login(data);
  }

  return (
    <div className="from-primary-800 flex h-dvh w-screen items-center justify-center bg-gradient-to-br to-black px-2 lg:h-[calc(100dvh-80px)]">
      <div className="flex w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="w-full p-8 sm:p-12 md:w-1/2">
          <h1 className="text-primary-600 mb-2 text-5xl font-extrabold">
            {t("hello")}
          </h1>
          <p className="mb-8 text-gray-700">{t("welcome_back")}</p>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <input
                type="email"
                placeholder={t("your_email")}
                defaultValue={"a7mdmo2mna7md@gmail.com"}
                className="focus:border-primary-600 w-full rounded-md border-2 border-black px-4 py-3 text-lg focus:outline-none"
                {...register("email", { required: true })}
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t("your_password")}
                defaultValue={"12345678"}
                className="focus:border-primary-600 w-full rounded-md border-2 border-black px-4 py-3 pr-12 text-lg focus:outline-none"
                {...register("password", { required: true })}
              />
              <button
                type="button"
                className="absolute top-4 right-4 text-xl text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <Link
                to="/forgot-password"
                className="text-primary-600 font-medium hover:underline"
              >
                {t("forgot_password")}
              </Link>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-black py-3 text-lg font-bold text-white transition-transform duration-300 hover:scale-105"
            >
              {t("login")}
            </button>

            <p className="mt-4 text-center text-sm text-gray-700">
              {t("dont_have_account")}{" "}
              <Link
                to="/signup"
                className="text-primary-600 font-medium hover:underline"
              >
                {t("signup")}
              </Link>
            </p>
          </form>
        </div>

        <div className="from-primary-600 relative hidden w-1/2 items-center justify-center bg-gradient-to-br to-slate-950 p-8 md:flex">
          <div className="absolute inset-0 mt-10 mb-30 rounded-3xl bg-[url('/src/assets/images/login.png')] bg-contain bg-center bg-no-repeat opacity-90"></div>
          <blockquote className="relative z-10 mt-auto px-4 text-center text-xl font-semibold text-white">
            {`“${t("imagination_quote")}”`}
            <br />
            <span className="text-sm font-normal">{t("einstein_quote")}</span>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default Login;
