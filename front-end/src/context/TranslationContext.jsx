import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../utils/translations";

const TranslationContext = createContext();

export function TranslationProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem("language");
    return savedLanguage || "en";
  });

  // Update document attributes and localStorage when language changes
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    document.dir = currentLanguage === "ar" ? "rtl" : "ltr";
    localStorage.setItem("language", currentLanguage);
    const root = document.getElementById("root");
    if (root) {
      root.className =
        currentLanguage === "ar"
          ? "font-arabic text-right"
          : "font-body text-left";
    }
  }, [currentLanguage]);

  // Translation function
  const t = (key) => {
    const translation = translations[currentLanguage]?.[key];
    return translation || key.replaceAll("_", " ");
  };

  // Toggle language function
  const toggleLanguage = () => {
    setCurrentLanguage((prev) => (prev === "en" ? "ar" : "en"));
  };

  const value = {
    currentLanguage,
    t,
    toggleLanguage,
    setLanguage: setCurrentLanguage,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}
