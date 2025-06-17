import { useGetCertificates } from "../hooks/user/useGetCertificates";
import { GiCancel } from "react-icons/gi";
import { FiDownload } from "react-icons/fi";
import { Link } from "react-router-dom";
import { MdOutlineScheduleSend } from "react-icons/md";
import Loader from "../ui/Loader";
import { useTranslation } from "../context/TranslationContext";

function Certificates() {
  const { t } = useTranslation();
  const { certificates, isLoading, error } = useGetCertificates();

  console.log(certificates);
  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        <p>
          {t("error")}: {error.message}
        </p>
      </div>
    );
  }

  if (!certificates?.length) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <GiCancel className="text-6xl text-red-400" />
        <h2 className="text-2xl font-semibold text-gray-300">
          {t("no_certificates_yet")}
        </h2>
        <p className="text-gray-400">{t("complete_roadmaps_to_earn")}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-12 text-center text-4xl font-bold text-white">
        {t("my_certificates")}
      </h1>
      <div className="flex flex-wrap gap-4">
        {certificates.map((certificate) => (
          <div
            key={certificate._id}
            className="group bg-footer-900/50 relative flex flex-col space-y-4 overflow-hidden rounded-2xl p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg">
              <img
                src={certificate.roadmap.image}
                alt={certificate.roadmap.title}
                className="h-[128px] w-[128px] object-cover"
              />
            </div>
            <h3 className="mb-4 text-center text-xl font-semibold text-white">
              {certificate.roadmap.title}
            </h3>
            <a
              href={`http://localhost:3000/api/student/certificates/${certificate._id}`}
              target="_blank"
              rel="noreferrer"
              download
              className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-700"
            >
              <FiDownload className="text-lg" />
              <span>{t("download_certificate")}</span>
            </a>
            <Link
              to={
                certificate.isBooked
                  ? "#"
                  : `/book-appointment/${certificate.roadmap._id}`
              }
              className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-white capitalize transition-colors ${
                certificate.isBooked
                  ? "cursor-not-allowed bg-gray-600"
                  : "bg-primary-600 hover:bg-primary-700"
              }`}
            >
              <MdOutlineScheduleSend className="text-xl" />
              <span>
                {certificate.isBooked
                  ? t("appointment_booked")
                  : t("make_an_appointment")}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Certificates;
