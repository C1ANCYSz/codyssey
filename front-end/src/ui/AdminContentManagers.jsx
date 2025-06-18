import { useGetContentManagers } from "../hooks/user/admin/useGetContentManagers";
import Loader from "./Loader";
import { PiPlus } from "react-icons/pi";
import { BiUserCircle } from "react-icons/bi";
import { TbForbidFilled } from "react-icons/tb";
import { useToggleRevoke } from "../hooks/user/admin/useToggleRevoke";
import { toast } from "react-hot-toast";
import { useAddContentManager } from "../hooks/user/admin/useAddContentManager";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { useTranslation } from "../context/TranslationContext";

function AdminContentManagers() {
  const [addContentManagerModal, setAddContentManagerModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const { contentManagersData: { contentManagers } = {}, isLoading } =
    useGetContentManagers();
  const { toggleRevoke, isLoading: isRevoking } = useToggleRevoke();
  const { addContentManager, isLoading: isAdding } = useAddContentManager();
  const { t } = useTranslation();
  const modalRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(
    function () {
      function handleClickOutside(event) {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target)
        ) {
          setAddContentManagerModal(false);
        }
      }
      modalRef.current?.addEventListener("click", handleClickOutside);
      return () => {
        modalRef.current?.removeEventListener("click", handleClickOutside);
      };
    },
    [modalRef.current, containerRef.current],
  );

  function addContentManagerHandler(data) {
    addContentManager(
      { email: data.email },
      {
        onSuccess: () => {
          setAddContentManagerModal(false);
          reset();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }
  if (isLoading) return <Loader />;

  return (
    <div className="from-primary-900 min-h-screen bg-gradient-to-br to-black p-8">
      {addContentManagerModal && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all duration-300"
        >
          <div
            ref={containerRef}
            className="w-full max-w-md transform rounded-2xl bg-white/10 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-md transition-all duration-300 hover:ring-white/20"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-2xl font-bold text-transparent">
                {t("add_content_manager")}
              </h2>
              <button
                onClick={() => setAddContentManagerModal(false)}
                className="rounded-full bg-white/5 p-2 transition-all duration-300 hover:bg-white/10"
                disabled={isAdding}
              >
                <IoMdClose className="text-2xl text-white/80" />
              </button>
            </div>
            <form
              onSubmit={handleSubmit(addContentManagerHandler)}
              className="flex flex-col gap-4"
            >
              <input
                type="email"
                placeholder={t("enter_email_address")}
                {...register("email", { required: true })}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-center text-white placeholder-white/50 transition-all duration-300 outline-none focus:border-white/20 focus:bg-white/10 focus:ring-2 focus:ring-white/10"
              />
              <button
                type="submit"
                className="bg-primary-600 mx-auto rounded-full p-3 px-4 font-medium text-white transition-all duration-300 focus:ring-2 focus:ring-white/20"
              >
                {t("add_manager")}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
        <div
          className="group relative flex h-[300px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-xl"
          onClick={() => setAddContentManagerModal(true)}
        >
          <PiPlus className="text-8xl text-white/80 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-90" />
        </div>

        {contentManagers?.map((manager) => (
          <div
            key={manager._id}
            className="group relative flex h-[300px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-xl"
          >
            {manager.isRevoked && (
              <div className="absolute top-4 right-4 z-10">
                <TbForbidFilled className="animate-pulse text-3xl text-red-500" />
              </div>
            )}

            <div className="relative mb-4">
              {manager.image ? (
                <img
                  src={manager.image}
                  alt={manager.name}
                  className="h-28 w-28 rounded-full object-cover ring-2 ring-white/20 transition-all duration-300 group-hover:ring-white/40"
                />
              ) : (
                <BiUserCircle className="text-8xl text-white/80" />
              )}
            </div>

            <h2 className="mb-2 text-2xl font-bold text-white/90 select-none">
              {manager.name}
            </h2>
            <p className="text-sm text-white/60 select-none">{manager.email}</p>
            <p className="mb-6 text-sm text-white/60 select-none">
              {manager.phoneNumber || t("no_phone_number")}
            </p>

            <button
              onClick={() =>
                toggleRevoke(manager.email, {
                  onSuccess: () => {
                    toast.success(
                      `${manager.name} ${manager.isRevoked ? t("has_been_unrevoked") : t("has_been_revoked")}`,
                    );
                  },
                })
              }
              disabled={isRevoking}
              className={`transform cursor-pointer rounded-lg px-6 py-2 text-sm font-medium transition-all duration-300 ${
                manager.isRevoked
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : "bg-red-500 hover:bg-red-600"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {manager.isRevoked ? t("unrevoke") : t("revoke")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminContentManagers;
