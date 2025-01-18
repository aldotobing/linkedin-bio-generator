// components/LanguageSelector.tsx

import React from "react";
import { motion } from "framer-motion";
import ReactCountryFlag from "react-country-flag";
import { Label } from "@/components/ui/label";

interface LanguageSelectorProps {
  language: string;
  setLanguage: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  setLanguage,
}) => {
  return (
    <div className="space-y-6">
      {/* Title */}
      <Label className="text-base sm:text-lg font-semibold text-indigo-700">
        🌐 Choose your language
      </Label>

      {/* Language Options */}
      <div className="flex justify-center gap-6">
        {/* English Language Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`relative flex items-center p-2 transition-all duration-300 ${
            language === "en"
              ? "border-2 border-blue-400 rounded-md"
              : "border-2 border-transparent"
          }`}
          onClick={() => setLanguage("en")}
        >
          <ReactCountryFlag
            countryCode="GB"
            svg
            style={{ height: "40px", width: "60px" }}
            title="English"
          />
          {language === "en" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1 text-xs shadow-lg"
            >
              ✔
            </motion.div>
          )}
        </motion.button>

        {/* Indonesian Language Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`relative flex items-center p-2 transition-all duration-300 ${
            language === "id"
              ? "border-2 border-red-400 rounded-md"
              : "border-2 border-transparent"
          }`}
          onClick={() => setLanguage("id")}
        >
          <ReactCountryFlag
            countryCode="ID"
            svg
            style={{ height: "40px", width: "60px" }}
            title="Indonesian"
          />
          {language === "id" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 text-xs shadow-lg"
            >
              ✔
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* Info Text */}
      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs sm:text-base text-gray-700 italic antialiased"
        >
          {language === "en"
            ? "Your bio will be written in English."
            : "Bio Anda akan ditulis dalam Bahasa Indonesia."}
        </motion.div>
      </div>
    </div>
  );
};

export default LanguageSelector;
