import { useTranslation } from "../context/TranslationContext";

function ToggleLanguage({ inSidebar = false }) {
  const { currentLanguage, toggleLanguage } = useTranslation();

  return (
    <div>
      <button
        className={`h-10 w-10 cursor-pointer border-white bg-gradient-to-r text-white uppercase transition-colors duration-200 ${inSidebar ? "hover:to-primary-800 w-full rounded-md from-blue-400 to-purple-500" : "to-primary-600 hover:to-primary-800 w-10 rounded-full from-cyan-700"}`}
        onClick={toggleLanguage}
      >
        {currentLanguage === "en" ? "AR" : "EN"}
      </button>
    </div>
  );
}

export default ToggleLanguage;
