import { useEffect, useRef, useState } from "react";
import {
  FaCheckCircle,
  FaRegCheckCircle,
  FaUsers,
  FaUserSecret,
} from "react-icons/fa";
import {
  FiBookOpen,
  FiHome,
  FiLogOut,
  FiSettings,
  FiUser,
  FiMenu,
  FiBell,
} from "react-icons/fi";
import { TbFileCertificate } from "react-icons/tb";
import { Link, NavLink } from "react-router-dom";
import { useLogout } from "../hooks/auth/useLogout";
import { useUiContext } from "../context/UiContext";
import { useGetNotification } from "../hooks/user/useGetNotification";
import { useEditNotification } from "../hooks/user/admin/useEditNotification";
import { useForm } from "react-hook-form";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { AiOutlineSchedule } from "react-icons/ai";
import { GrScheduleNew } from "react-icons/gr";
import { MdOutlineRecommend } from "react-icons/md";
import { useTranslation } from "../context/TranslationContext";
import ToggleLanguage from "./ToggleLanguage";

function Sidebar({ user }) {
  const { register, handleSubmit } = useForm();
  const { name, role } = user || {};
  const { logout } = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const containerRef = useRef(null);
  const modalRef = useRef(null);
  const { openModal, setOpenModal } = useUiContext();
  const { notification } = useGetNotification();
  const { editNotification } = useEditNotification();
  const { t } = useTranslation();

  const navItemsStudent = [
    {
      to: "/dashboard",
      icon: <FiHome className="text-xl" />,
      label: t("dashboard"),
    },
    {
      to: "/roadmaps",
      icon: <FiBookOpen className="text-xl" />,
      label: t("roadmaps"),
    },
    {
      to: "/certificates",
      icon: <TbFileCertificate className="text-xl" />,
      label: t("certificates"),
    },
    {
      to: "/appointments",
      icon: <GrScheduleNew className="text-xl" />,
      label: t("appointments"),
    },
    {
      to: "/recommendations",
      icon: <MdOutlineRecommend className="text-xl" />,
      label: t("recommendations"),
    },
  ];

  const navItemsContentManager = [
    {
      to: "/roadmaps",
      icon: <FiBookOpen className="text-xl" />,
      label: t("roadmaps"),
    },
    {
      to: "/add-roadmap",
      icon: <FiBookOpen className="text-xl" />,
      label: t("add_roadmap"),
    },
  ];

  const navItemsAdmin = [
    {
      to: "/dashboard",
      icon: <FiHome className="text-xl" />,
      label: t("dashboard"),
    },
    {
      to: "/admin/content-managers",
      icon: <FaUsers className="text-xl" />,
      label: t("content_managers"),
    },
    {
      to: "/admin/academies",
      icon: <FaUsers className="text-xl" />,
      label: t("academies"),
    },
    {
      label: t("notifications"),
      icon: <FiBell className="text-xl" />,
      button: true,
    },
  ];

  const navItemsAcademy = [
    {
      to: "/dashboard",
      icon: <FiHome className="text-xl" />,
      label: t("dashboard"),
    },
    {
      to: "/academy/pending-appointments",
      icon: <RiCalendarScheduleLine className="text-xl" />,
      label: t("pending_appointments"),
    },
    {
      to: "/academy/accepted-appointments",
      icon: <AiOutlineSchedule className="text-xl" />,
      label: t("accepted_appointments"),
    },
    {
      to: "/academy/completed-appointments",
      icon: <FaRegCheckCircle className="text-xl text-green-500" />,
      label: t("completed_appointments"),
    },
  ];

  const navItems = {
    student: navItemsStudent,
    "content manager": navItemsContentManager,
    admin: navItemsAdmin,
    academy: navItemsAcademy,
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  function editNotificationHandler(data) {
    editNotification(data, {
      onSuccess: () => {
        setOpenModal(false);
      },
    });
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpenModal(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === "Escape" && openModal) {
        setOpenModal(false);
      }
    }
    modalRef.current?.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      modalRef.current?.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openModal]);

  return (
    <>
      {/* Notification Modal */}
      {openModal && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md transition-all duration-300"
        >
          <div
            ref={containerRef}
            className="w-full max-w-md transform rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-2xl ring-1 ring-white/20 transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              className="flex flex-col gap-5"
              onSubmit={handleSubmit(editNotificationHandler)}
            >
              <h2 className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-center text-2xl font-bold text-transparent">
                {t("notification")}
              </h2>
              <div className="relative flex items-center gap-2 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-white backdrop-blur-lg transition-all duration-300">
                <input
                  type="text"
                  placeholder={t("message")}
                  className="flex-1 bg-transparent text-lg outline-none"
                  defaultValue={notification?.text}
                  {...register("text")}
                />
                <button className="cursor-pointer transition-transform hover:scale-110">
                  <FaCheckCircle className="text-2xl text-green-500" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 rounded-lg bg-white/10 p-2 text-white md:hidden"
        aria-label={t("toggle_menu")}
      >
        <FiMenu className="text-2xl" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 flex h-full w-[280px] flex-col justify-between space-y-4 bg-gradient-to-b from-gray-900 to-gray-950 p-6 text-white shadow-2xl transition-transform duration-500 ease-in-out md:w-[300px] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:translate-x-0`}
      >
        {/* Header */}
        <div className="space-y-8">
          <div className="flex items-center justify-center">
            <h2 className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
              CODYSSEY
            </h2>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-gray-800/50 p-4 backdrop-blur-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
              {role === "admin" ? (
                <FaUserSecret className="text-xl" />
              ) : (
                <FiUser className="text-xl" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-400">
                {t("welcome_back_dashboard")}
              </p>
              <p className="font-bold text-white">{name || t("mudai")}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          <ul className="space-y-2">
            {navItems[role]?.map((item, index) => (
              <li key={index}>
                {item.button ? (
                  <button
                    onClick={handleOpenModal}
                    className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all hover:bg-white/10"
                  >
                    <span className="text-white/60 transition-colors group-hover:text-white">
                      {item.icon}
                    </span>
                    <span className="font-medium text-white/80 transition-colors group-hover:text-white">
                      {item.label}
                    </span>
                  </button>
                ) : (
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all hover:bg-white/10 ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:text-white"
                      }`
                    }
                  >
                    <span className="transition-colors group-hover:text-white">
                      {item.icon}
                    </span>
                    <span className="font-medium transition-colors group-hover:text-white">
                      {item.label}
                    </span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="space-y-4">
          <ToggleLanguage inSidebar={true} />
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all hover:bg-white/10 ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white"
              }`
            }
          >
            <FiSettings className="text-xl transition-colors group-hover:text-white" />
            <span className="font-medium transition-colors group-hover:text-white">
              {t("settings")}
            </span>
          </NavLink>

          <button
            onClick={logout}
            className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-white/60 transition-all hover:bg-white/10 hover:text-white"
          >
            <FiLogOut className="text-xl transition-colors group-hover:text-white" />
            <span className="font-medium transition-colors group-hover:text-white">
              {t("logout")}
            </span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}

export default Sidebar;
