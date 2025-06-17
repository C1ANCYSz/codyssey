import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthProvider";
import { useState, useRef, useEffect } from "react";
import {
  FaPlus,
  FaMapMarkerAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaImage,
  FaLock,
} from "react-icons/fa";
import { useGetSettings } from "../hooks/user/useGetSettings";
import { useUpdateSettings } from "../hooks/user/useUpdateSettings";
import toast from "react-hot-toast";
import Loader from "../ui/Loader";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../context/TranslationContext";

function Settings() {
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const { setUser, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { user: { role } = {} } = useAuth();
  const { settings, isLoading } = useGetSettings();
  const modalRef = useRef(null);
  const containerRef = useRef(null);
  const { updateSettings } = useUpdateSettings();
  const { name, email, phoneNumber, image, locations = [] } = settings ?? {};
  const { t } = useTranslation();

  const { register, handleSubmit, getValues, reset } = useForm({
    defaultValues: { name, email, phoneNumber, image, locations },
  });

  const [locationsInputs, setLocationsInputs] = useState([]);

  // Form submission handler / معالج تقديم النموذج
  const onSubmit = (data) => {
    const {
      name,
      email,
      phoneNumber,
      image,
      locations,
      newLocations,
      newPassword,
      password,
    } = data;

    const baseSettings = { name, email, password };

    if (newPassword) {
      baseSettings.newPassword = newPassword;
    }

    const roleSpecificSettings =
      role === "content manager" || role === "academy"
        ? { phoneNumber, image }
        : {};

    const locationSettings =
      role === "academy" && newLocations?.length > 0
        ? { locations: [...locations, ...newLocations] }
        : {};

    const newSettings = {
      ...baseSettings,
      ...roleSpecificSettings,
      ...locationSettings,
    };

    updateSettings(newSettings, {
      onSuccess: () => {
        reset({ name, email, phoneNumber, image, locations });
        setOpenPasswordModal(false);
        if (newPassword) {
          setUser(null);
          setIsLoggedIn(false);
          navigate("/login");
        }
      },
    });
  };

  // Error handler / معالج الأخطاء
  const onError = (error) => {
    const errorMessage =
      error?.confirmPassword?.message ||
      error?.name?.message ||
      error?.email?.message;
    toast.error(errorMessage);
  };

  // Modal click outside handler / معالج النقر خارج النافذة المنبثقة
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpenPasswordModal(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape" && openPasswordModal) {
        setOpenPasswordModal(false);
      }
    };

    const modalElement = modalRef.current;

    modalElement?.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      modalElement?.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openPasswordModal]);

  if (isLoading) return <Loader />;

  // Form input component / مكون إدخال النموذج
  const FormInput = ({
    label,
    type = "text",
    id,
    defaultValue,
    validation = {},
    icon: Icon,
  }) => (
    <div className="relative flex w-full items-center rounded-lg border border-white/10 bg-white/5 p-3 transition-all hover:border-white/20 hover:bg-white/10">
      {Icon && <Icon className="absolute left-3 text-white/40" />}
      <div className="flex w-full flex-col gap-1 pl-8">
        <label htmlFor={id} className="text-xs font-medium text-white/40">
          {label}
        </label>
        <input
          type={type}
          id={id}
          defaultValue={defaultValue}
          className="w-full bg-transparent text-white outline-none placeholder:text-white/20"
          {...register(id, validation)}
        />
      </div>
    </div>
  );

  return (
    <div className="from-primary-900 flex min-h-screen w-full items-center justify-center bg-gradient-to-br to-black p-4">
      {openPasswordModal && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <form
            ref={containerRef}
            className="animate-fadeIn flex w-full max-w-lg flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl"
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <h1 className="text-center text-2xl font-bold text-white">
              {t("confirm_your_password")}
            </h1>
            <FormInput
              type="password"
              id="password"
              label={t("password")}
              icon={FaLock}
            />
            <button className="bg-primary-500 rounded-lg p-3 text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-blue-500/25">
              {t("confirm_changes")}
            </button>
          </form>
        </div>
      )}

      <div className="animate-fadeIn w-full max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="from-primary-300 to-primary-600 mb-8 bg-gradient-to-r bg-clip-text text-center text-3xl font-bold text-transparent">
          {t("account_settings")}
        </h1>
        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <FormInput
            id="name"
            label={t("full_name")}
            defaultValue={name}
            validation={{ required: t("name_required") }}
            icon={FaUser}
          />

          <FormInput
            type="email"
            id="email"
            label={t("email")}
            defaultValue={email}
            validation={{ required: t("email_required") }}
            icon={FaEnvelope}
          />

          {(role === "content manager" || role === "academy") && (
            <>
              <FormInput
                id="phoneNumber"
                label={t("phone_number")}
                defaultValue={phoneNumber}
                icon={FaPhone}
              />
              <FormInput
                type="file"
                id="image"
                label={t("profile_image")}
                icon={FaImage}
              />
            </>
          )}

          {role === "academy" && (
            <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-white/40" />
                  <h3 className="text-lg font-medium text-white">
                    {t("locations")}
                  </h3>
                </div>
                <button
                  type="button"
                  className="bg-primary-500 rounded-full p-2 text-white shadow-lg transition-all hover:scale-110"
                  onClick={() => setLocationsInputs([...locationsInputs, ""])}
                >
                  <FaPlus className="text-xl" />
                </button>
              </div>

              <div className="grid gap-4">
                {locations.map((location, index) => (
                  <FormInput
                    key={index}
                    id={`locations.${index}`}
                    defaultValue={location}
                    label={`${t("location")} ${index + 1}`}
                    icon={FaMapMarkerAlt}
                  />
                ))}

                {locationsInputs.map((_, index) => (
                  <FormInput
                    key={index}
                    id={`newLocations.${index}`}
                    label={`${t("new_location")} ${index + 1}`}
                    icon={FaMapMarkerAlt}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="flex items-center gap-2 text-lg font-medium text-white">
              <FaLock className="text-white/40" />
              {t("change_password")}
            </h3>
            <div className="grid gap-4">
              <FormInput
                type="password"
                id="newPassword"
                label={t("new_password")}
                icon={FaLock}
              />
              <FormInput
                type="password"
                id="confirmPassword"
                label={t("confirm_password")}
                icon={FaLock}
                validation={{
                  validate: (value) =>
                    value === getValues("newPassword") ||
                    t("passwords_dont_match"),
                }}
              />
            </div>
          </div>
        </form>

        <button
          className="from-primary-600 via-primary-700 to-primary-900 mt-8 w-full rounded-lg bg-gradient-to-r p-4 text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-blue-500/25"
          onClick={() => setOpenPasswordModal(true)}
        >
          {t("save_changes")}
        </button>
      </div>
    </div>
  );
}

export default Settings;
