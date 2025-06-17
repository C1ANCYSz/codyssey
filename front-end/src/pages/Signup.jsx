import { useState } from "react";
import { Link } from "react-router-dom";
import { useSignup } from "../hooks/auth/useSignup";
import { FaCode, FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useTranslation } from "../context/TranslationContext";

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { signup, isLoading, error } = useSignup();

  // استخدم دالة الترجمة t من السياق
  const { t } = useTranslation();

  const onSubmit = (data) => {
    signup(data);
  };

  return (
    <div className="from-primary-800 flex min-h-screen w-full items-center justify-center bg-gradient-to-br to-black p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Image & branding */}
          <div className="from-primary-600 hidden bg-gradient-to-br to-indigo-900 p-12 text-white lg:flex lg:w-5/12">
            <div className="flex h-full flex-col justify-between">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">
                  {t("join_our_community") || "Join our community"}
                </h2>
                <p className="text-violet-200">
                  {t("signup_left_description") ||
                    "Create an account and unlock exclusive features designed for you."}
                </p>
              </div>
              <div className="ml-auto">
                <FaCode className="text-[200px] text-white/30" />
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full p-6 sm:p-10 lg:w-7/12">
            <div className="mb-8">
              <h1 className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent">
                {t("create_account")}
              </h1>
              <p className="mt-2 text-gray-500">
                {t("signup_hero_description") ||
                  "Join us and start your journey"}
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Name field */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {t("full_name") || "Full Name"}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={t("enter_your_name") || "Enter your name"}
                  className={`w-full rounded-lg border ${
                    errors.name ? "border-red-400" : "border-gray-300"
                  } px-4 py-3 transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-200 focus:outline-none`}
                  {...register("name", {
                    required: t("name_required") || "Name is required",
                    minLength: {
                      value: 3,
                      message:
                        t("name_min_length") ||
                        "Name must be at least 3 characters long",
                    },
                  })}
                />
                {errors.name?.message && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name?.message}
                  </p>
                )}
              </div>

              {/* Email field */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {t("email_address") || "Email Address"}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t("your_email") || "name@example.com"}
                  className={`w-full rounded-lg border ${
                    errors.email ? "border-red-400" : "border-gray-300"
                  } px-4 py-3 transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-200 focus:outline-none`}
                  {...register("email", {
                    required: t("email_required") || "Email is required",
                  })}
                />
                {errors.email?.message && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email?.message}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {t("your_password") || "Password"}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      t("password_min_length") || "At least 8 characters"
                    }
                    className={`w-full rounded-lg border ${
                      errors.password ? "border-red-400" : "border-gray-300"
                    } px-4 py-3 pr-12 transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-200 focus:outline-none`}
                    {...register("password", {
                      required:
                        t("password_required") || "Password is required",
                      minLength: {
                        value: 8,
                        message:
                          t("password_min_length") ||
                          "Password must be at least 8 characters long",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={
                      showPassword
                        ? t("hide_password") || "Hide password"
                        : t("show_password") || "Show password"
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password?.message && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password?.message}
                  </p>
                )}
              </div>

              {/* Confirm Password field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {t("confirm_password") || "Confirm Password"}
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder={
                      t("confirm_your_password") || "Confirm your password"
                    }
                    className={`w-full rounded-lg border ${
                      errors.confirmPassword
                        ? "border-red-400"
                        : "border-gray-300"
                    } px-4 py-3 pr-12 transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-200 focus:outline-none`}
                    {...register("confirmPassword", {
                      required:
                        t("confirm_password_required") ||
                        "Please confirm your password",
                      validate: (value) =>
                        value === getValues("password") ||
                        t("passwords_do_not_match") ||
                        "Passwords do not match",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={
                      showConfirm
                        ? t("hide_password") || "Hide password"
                        : t("show_password") || "Show password"
                    }
                  >
                    {showConfirm ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword?.message && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword?.message}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 font-medium text-white shadow-lg shadow-violet-200 transition-all hover:from-violet-700 hover:to-purple-700 focus:ring-2 focus:ring-violet-500 focus:outline-none disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="mr-2 h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t("creating_account") || "Creating Account..."}
                  </span>
                ) : (
                  t("create_account")
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {t("already_have_account") || "Already have an account?"}{" "}
                <Link
                  to="/login"
                  className="font-medium text-violet-600 underline-offset-2 hover:text-violet-800 hover:underline"
                >
                  {t("sign_in") || "Sign in"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
