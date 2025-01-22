import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const languages = [
  { code: "en", name: "English" },
  { code: "lv", name: "Latviešu" },
  { code: "lt", name: "Lietuvių" },
];

interface LanguageSelectorProps {
  variant?: "default" | "login";
}

export function LanguageSelector({ variant = "default" }: LanguageSelectorProps) {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    setCurrentLang(value);
  };

  const triggerClassName = variant === "login"
    ? "w-[140px] bg-white border-input text-foreground"
    : "w-[140px] bg-white/10 border-white/20 text-white hover:bg-white/20";

  return (
    <Select value={currentLang} onValueChange={handleLanguageChange}>
      <SelectTrigger className={triggerClassName}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-white border shadow-lg">
        {languages.map((lang) => (
          <SelectItem 
            key={lang.code} 
            value={lang.code}
            className="hover:bg-gray-100 cursor-pointer"
          >
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}