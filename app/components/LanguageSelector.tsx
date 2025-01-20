import React from "react";
import { motion } from "framer-motion";
import ReactCountryFlag from "react-country-flag";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  language: string;
  setLanguage: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  setLanguage,
}) => {
  const languages = [
    {
      code: "en",
      countryCode: "GB",
      message: "Your bio will be crafted in English ✨",
      accentColor: "blue",
    },
    {
      code: "id",
      countryCode: "ID",
      message: "Bio Anda akan ditulis dalam Bahasa Indonesia ✨",
      accentColor: "red",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title with animated globe */}
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Globe className="w-5 h-5 text-indigo-600" />
        </motion.div>
        <Label className="text-base sm:text-md font-semibold text-indigo-700">
          Choose your Language
        </Label>
      </div>

      {/* Language Options */}
      <div className="flex justify-center gap-6">
        {languages.map((lang) => (
          <motion.button
            key={lang.code}
            whileHover={{
              scale: 1.05,
              y: -5,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative group flex flex-col items-center p-3 rounded-xl
              transition-all duration-300 transform
              ${
                language === lang.code
                  ? `bg-${lang.accentColor}-50 shadow-lg ring-2 ring-${lang.accentColor}-400`
                  : "hover:bg-gray-50"
              }
            `}
            onClick={() => setLanguage(lang.code)}
          >
            {/* Flag with hover effect */}
            <motion.div
              className="relative"
              //whileHover={{ rotate: [0, -5, 5, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <ReactCountryFlag
                countryCode={lang.countryCode}
                svg
                style={{
                  height: "50px",
                  width: "60px",
                  filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
                }}
              />

              {/* Selection indicator */}
              {/* {language === lang.code && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`absolute -top-3 -right-3 bg-${lang.accentColor}-500 text-white rounded-full p-1.5 shadow-sm`}
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  ></motion.span>
                </motion.div>
              )} */}
            </motion.div>
          </motion.button>
        ))}
      </div>

      {/* Animated Info Text */}
      <div className="flex justify-center">
        <motion.div
          key={language}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-gray-600 italic text-center px-4 py-2 rounded-full"
        >
          {languages.find((lang) => lang.code === language)?.message}
        </motion.div>
      </div>
    </div>
  );
};

export default LanguageSelector;
