// src/contexts/LanguageContext.tsx
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'si' | 'ta';

const translations = {
  en: {
    "police.dept": "Sri Lanka Police Department",
    "system.title": "Traffic Fine Management System",
    "card.pay.title": "Pay Traffic Fine",
    "card.pay.desc": "Pay your traffic fine online securely with your reference number.",
    "card.pay.cta": "Enter Portal",
    "card.search.title": "Record Lookup",
    "card.search.desc": "Lost your ticket? Search pending fines by NIC or Vehicle No.",
    "card.search.cta": "Search Records",
    "card.admin.title": "Admin Dashboard",
    "card.admin.desc": "Senior personnel monitoring & national overview.",
    "card.admin.cta": "Official Access",
    "footer": "Powered by Ministry of Public Administration • Sri Lanka • 2026", // <-- ADDED COMMA HERE
    "card.dispute.title": "Dispute a Fine",
    "card.dispute.desc": "Submit a formal appeal and upload digital evidence.",
    "card.dispute.cta": "Open Tribunal",
  },
  si: {
    "police.dept": "ශ්‍රී ලංකා පොලිස් දෙපාර්තමේන්තුව",
    "system.title": "රථවාහන දඩ කළමනාකරණ පද්ධතිය",
    "card.pay.title": "රථවාහන දඩ ගෙවන්න",
    "card.pay.desc": "ඔබගේ යොමු අංකය සමඟ මාර්ගගතව දඩ මුදල් ගෙවන්න.",
    "card.pay.cta": "පිවිසෙන්න",
    "card.search.title": "වාර්තා සෙවීම",
    "card.search.desc": "ජාතික හැඳුනුම්පත හෝ වාහන අංකය මගින් දඩ වාර්තා සොයන්න.",
    "card.search.cta": "වාර්තා සොයන්න",
    "card.admin.title": "පරිපාලක පුවරුව",
    "card.admin.desc": "ජ්‍යෙෂ්ඨ නිලධාරීන්ගේ අධීක්ෂණය සහ ජාතික දළ විශ්ලේෂණය.",
    "card.admin.cta": "නිල ප්‍රවේශය",
    "footer": "රාජ්‍ය පරිපාලන අමාත්‍යාංශය මගින් බලගන්වා ඇත • ශ්‍රී ලංකාව • 2026", // <-- ADDED COMMA HERE
    "card.dispute.title": "දඩ අභියාචනය",
    "card.dispute.desc": "විධිමත් අභියාචනයක් ඉදිරිපත් කර ඩිජිටල් සාක්ෂි උඩුගත කරන්න.",
    "card.dispute.cta": "විවෘත කරන්න",
  },
  ta: {
    "police.dept": "இலங்கை பொலிஸ் திணைக்களம்",
    "system.title": "போக்குவரத்து அபராத முகாமைத்துவ அமைப்பு",
    "card.pay.title": "அபராதம் செலுத்த",
    "card.pay.desc": "உங்கள் குறிப்பு எண்ணுடன் ஆன்லைனில் அபராதம் செலுத்துங்கள்.",
    "card.pay.cta": "உள்நுழைக",
    "card.search.title": "பதிவுகளை தேடு",
    "card.search.desc": "அடையாள அட்டை அல்லது வாகன எண் மூலம் அபராதங்களை தேடுங்கள்.",
    "card.search.cta": "பதிவுகளை தேடு",
    "card.admin.title": "நிர்வாகி டாஷ்போர்டு",
    "card.admin.desc": "மூத்த அதிகாரிகளின் கண்காணிப்பு மற்றும் தேசிய கண்ணோட்டம்.",
    "card.admin.cta": "அதிகாரப்பூர்வ அணுகல்",
    "footer": "பொது நிர்வாக அமைச்சகத்தால் இயக்கப்படுகிறது • இலங்கை • 2026", // <-- ADDED COMMA HERE
    "card.dispute.title": "அபராதம் மேல்முறையீடு",
    "card.dispute.desc": "முறையான மேல்முறையீட்டைச் சமர்ப்பித்து டிஜிட்டல் சான்றுகளைப் பதிவேற்றவும்.",
    "card.dispute.cta": "திறக்க",
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: keyof typeof translations['en']) => {
    return translations[language][key] || translations['en'][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};