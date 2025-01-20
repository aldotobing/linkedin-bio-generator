"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { marked } from "marked";
import AdditionalDetailsSection from "./AdditionalDetailsSection";
import LanguageSelector from "./LanguageSelector";
import { fetchGeneratedBio } from "../api/Meta";
import { VibeSelector } from "./VibeSelector";
import RoleInput from "./RoleInput";
import CopyToClipboardButton from "./CopyToClipboardButton";
import FormattedBio from "./FormattedBio";
import { CoverLetterGenerator } from "./CoverLetterGenerator";

export function BioGenerator() {
  const [role, setRole] = useState("");
  const [isTemplateVisible, setIsTemplateVisible] = useState(false);
  const [vibe, setVibe] = useState("Professional");
  const [additionalContext, setAdditionalContext] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBio, setGeneratedBio] = useState("");
  const [isCopying, setIsCopying] = useState(false);
  const [language, setLanguage] = useState("en");
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [selectedVibe, setSelectedVibe] = useState("");

  // Add the roleRef
  const roleRef = useRef<HTMLInputElement>(null);

  async function generateBio() {
    if (!role) {
      toast.error("Please enter your role first!");
      return;
    }

    setIsGenerating(true);
    setGeneratedBio("");

    try {
      const bio = await fetchGeneratedBio({
        role,
        vibe,
        additionalContext,
        language,
      });
      setGeneratedBio(bio);
      toast.success("Your bio is ready! ✨");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleCopy() {
    if (navigator.clipboard && window.ClipboardItem) {
      Promise.resolve(formattedBio).then((resolvedBio) => {
        const blob = new Blob([resolvedBio], { type: "text/html" });
        const clipboardItem = new ClipboardItem({ "text/html": blob });
        navigator.clipboard.write([clipboardItem]);
      });
    } else {
      // Fallback kalau browser nggak support copy HTML
      const tempElement = document.createElement("div");
      Promise.resolve(formattedBio).then((resolvedBio) => {
        tempElement.innerHTML = resolvedBio;
      });
      document.body.appendChild(tempElement);
      const range = document.createRange();
      range.selectNode(tempElement);
      let selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      document.execCommand("copy");
      selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
      }
      document.body.removeChild(tempElement);
    }
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  }

  function addLineBreaksToBold(text: string) {
    return text.replace(/\*\*(.*?)\*\*:/g, "**$1**:<br>");
  }
  // Parse the markdown into HTML
  const formattedBio = marked(addLineBreaksToBold(generatedBio));

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <Card className="p-4 sm:p-6 md:p-8 shadow-lg border-2 border-indigo-100 bg-gradient-to-br from-indigo-100 to-white">
        <div className="space-y-4 sm:space-y-6">
          {/* Role Input with Templates */}
          <RoleInput
            role={role}
            setRole={setRole}
            isTemplateVisible={isTemplateVisible}
            setIsTemplateVisible={setIsTemplateVisible}
            handleTemplateClick={(template: string) => setRole(template)}
            roleRef={roleRef} // Pass the ref to RoleInput
          />

          {/* Vibe Selector Component */}
          <VibeSelector
            selectedVibe={selectedVibe}
            setVibe={setVibe}
            setActiveHint={setActiveHint}
            setSelectedVibe={setSelectedVibe}
          />

          {/* Additional Details */}
          <AdditionalDetailsSection
            additionalContext={additionalContext}
            setAdditionalContext={setAdditionalContext}
            role={role}
            vibe={vibe}
            roleRef={roleRef} // Pass the ref to AdditionalDetailsSection
          />

          {/* Language Selection */}
          <LanguageSelector language={language} setLanguage={setLanguage} />

          {/* Generate Button */}
          <Button
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-purple-500 hover:to-indigo-500 shadow-lg text-sm sm:text-base transition-all duration-500 transform hover:scale-105 active:scale-95"
            size="lg"
            onClick={generateBio}
            disabled={!role || isGenerating}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-sm sm:text-base font-semibold"
                >
                  Crafting your bio...
                </motion.span>
              </div>
            ) : (
              <motion.span
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm sm:text-base font-semibold"
              >
                Generate Bio ✨
              </motion.span>
            )}
          </Button>
        </div>

        <AnimatePresence>
          {generatedBio && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6"
            >
              <Card className="p-4 sm:p-6 shadow-lg border-2 border-green-400 bg-gradient-to-br from-green-100 to-white">
                <Label className="text-base sm:text-lg font-semibold text-green-700">
                  🚀 Your Generated Bio
                </Label>

                <div
                  className="mt-2 sm:mt-4 min-h-[150px] sm:min-h-[200px] focus:ring-4 focus:ring-green-200 text-sm sm:text-base"
                  style={{
                    whiteSpace: "pre-line",
                  }}
                >
                  <FormattedBio generatedBio={generatedBio} />
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 flex flex-col items-center gap-4"
                >
                  {/* Copy to Clipboard Button */}
                  <CopyToClipboardButton
                    isCopying={isCopying}
                    handleCopy={handleCopy}
                  />
                </motion.div>
              </Card>
              {/* Tombol Generate Cover Letter di Bawah */}
              <div className="mt-6 flex justify-center">
                <CoverLetterGenerator
                  bioContext={generatedBio}
                  role={role}
                  vibe={vibe}
                  language={language}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-purple-500 hover:to-indigo-500 shadow-lg text-sm sm:text-base transition-all duration-500 transform hover:scale-105 active:scale-95"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
