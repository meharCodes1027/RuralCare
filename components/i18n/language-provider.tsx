"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import i18next from "i18next"
import { initReactI18next, useTranslation as useTranslationOriginal } from "react-i18next"

// Define available languages
const languages = {
  en: { nativeName: "English" },
  hi: { nativeName: "हिन्दी" },
  ta: { nativeName: "தமிழ்" },
  te: { nativeName: "తెలుగు" },
  bn: { nativeName: "বাংলা" },
}

// Initialize i18next
i18next.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        // English translations
        "app.title": "RuralCare AI",
        "app.subtitle": "Smart Risk & Resource Optimizer",
        "login.title": "Login",
        "login.email": "Email",
        "login.password": "Password",
        "login.role": "Role",
        "login.button": "Login",
        "login.signup": "Sign Up",
        "login.demo": "Demo credentials: demo@ruralcare.org / password",
        "role.doctor": "Doctor",
        "role.health_worker": "Health Worker",
        "dashboard.home": "Dashboard",
        "dashboard.patients": "Patients",
        "dashboard.risk": "Risk Predictor",
        "dashboard.vaccine": "Vaccine Forecast",
        "dashboard.map": "Health Map",
        "dashboard.analytics": "Analytics",
        "dashboard.settings": "Settings",
        "dashboard.logout": "Logout",
        "risk.title": "Patient Risk Predictor",
        "risk.description": "Enter patient information to predict surgical risk and get recommendations.",
        "vaccine.title": "Vaccine Stock Forecast",
        "vaccine.description": "Predict vaccine depletion dates and get reorder recommendations.",
        "map.title": "Health Coverage Map",
        "map.description": "Interactive map showing risk zones, vaccine stock levels, and coverage areas.",
        "analytics.title": "Analytics Dashboard",
        "analytics.description": "Key metrics and trends for patient risk, vaccine usage, and referrals.",
      },
    },
    hi: {
      translation: {
        // Hindi translations
        "app.title": "रूरलकेयर एआई",
        "app.subtitle": "स्मार्ट रिस्क और रिसोर्स ऑप्टिमाइज़र",
        "login.title": "लॉगिन",
        "login.email": "ईमेल",
        "login.password": "पासवर्ड",
        "login.role": "भूमिका",
        "login.button": "लॉगिन करें",
        "login.signup": "साइन अप करें",
        "login.demo": "डेमो क्रेडेंशियल: demo@ruralcare.org / password",
        "role.doctor": "डॉक्टर",
        "role.health_worker": "स्वास्थ्य कार्यकर्ता",
        "dashboard.home": "डैशबोर्ड",
        "dashboard.patients": "मरीज़",
        "dashboard.risk": "जोखिम भविष्यवाणी",
        "dashboard.vaccine": "वैक्सीन पूर्वानुमान",
        "dashboard.map": "स्वास्थ्य मानचित्र",
        "dashboard.analytics": "विश्लेषण",
        "dashboard.settings": "सेटिंग्स",
        "dashboard.logout": "लॉगआउट",
        "risk.title": "मरीज़ जोखिम भविष्यवाणी",
        "risk.description": "सर्जिकल जोखिम की भविष्यवाणी करने और सिफारिशें प्राप्त करने के लिए मरीज़ की जानकारी दर्ज करें।",
        "vaccine.title": "वैक्सीन स्टॉक पूर्वानुमान",
        "vaccine.description": "वैक्सीन समाप्ति तिथियों की भविष्यवाणी करें और पुनः ऑर्डर सिफारिशें प्राप्त करें।",
        "map.title": "स्वास्थ्य कवरेज मानचित्र",
        "map.description": "जोखिम क्षेत्र, वैक्सीन स्टॉक स्तर और कवरेज क्षेत्र दिखाने वाला इंटरैक्टिव मानचित्र।",
        "analytics.title": "विश्लेषण डैशबोर्ड",
        "analytics.description": "मरीज़ जोखिम, वैक्सीन उपयोग और रेफरल के लिए प्रमुख मेट्रिक्स और रुझान।",
      },
    },
    ta: {
      translation: {
        // Tamil translations (basic)
        "app.title": "ரூரல்கேர் AI",
        "app.subtitle": "ஸ்மார்ட் ரிஸ்க் & ரிசோர்ஸ் ஆப்டிமைசர்",
        "login.title": "உள்நுழைவு",
        "dashboard.home": "டாஷ்போர்டு",
        "dashboard.patients": "நோயாளிகள்",
        "dashboard.risk": "அபாய கணிப்பான்",
        "dashboard.vaccine": "தடுப்பூசி முன்கணிப்பு",
        "dashboard.map": "சுகாதார வரைபடம்",
        "dashboard.analytics": "பகுப்பாய்வு",
        "dashboard.settings": "அமைப்புகள்",
        "dashboard.logout": "வெளியேறு",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
})

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  languages: Record<string, { nativeName: string }>
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en"
    setLanguageState(savedLanguage)
    i18next.changeLanguage(savedLanguage)
  }, [])

  const setLanguage = (lang: string) => {
    setLanguageState(lang)
    i18next.changeLanguage(lang)
    localStorage.setItem("language", lang)
    document.documentElement.lang = lang
  }

  return <LanguageContext.Provider value={{ language, setLanguage, languages }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

export const useTranslation = useTranslationOriginal
