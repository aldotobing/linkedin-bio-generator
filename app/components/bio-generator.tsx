"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, Sparkles, Copy, Info } from "lucide-react";
import { toast } from "react-hot-toast";
import { marked } from "marked";
import ReactCountryFlag from "react-country-flag";
import { templates, vibeOptions } from "./options";
import AdditionalDetailsSection from "./AdditionalDetailsSection";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL || "";

const shuffleArray = (array: string[]) => {
  return array.sort(() => Math.random() - 0.5);
};

const shuffledTemplates = shuffleArray([...templates]);

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

  async function generateBio() {
    if (!role) {
      toast.error("Please enter your role first!");
      return;
    }

    setIsGenerating(true);
    setGeneratedBio("");

    const prompt = `Create a compelling LinkedIn bio for a ${role}.
${additionalContext ? `Additional Context: ${additionalContext}` : ""}

Follow these guidelines:
1. Style: Make it with ${vibe} vibe, engaging, and authentic.

2. Structure:
   - Hook: Start with an attention-grabbing opener that defines your professional identity
   - Impact: Highlight 2-3 specific achievements and kind of problems you solve and for whom with what results and methods
   - Expertise: Mention your core technical skills and specializations
   - Value: Describe your unique approach or methodology that sets you apart
   - Vision: End with a clear purpose or call to action

3. Must Include:
   - At least one quantifiable achievement
   - Current role focus and expertise level
   - Key technical skills relevant to ${role}
   - Professional passion or driving motivation

4. Format:
   - Length: 2-3 concise paragraphs (350-500 characters)
   - Tone: Confident but approachable
   - Voice: First-person narrative
   ${
     language === "id"
       ? "Make it in Professional Indonesian language (Bahasa baku)"
       : ""
   }

5. Avoid:
   - Generic buzzwords and clichés
   - Personal information unrelated to career
   - Overly formal or casual language
   - Translation notes or word/character counts
   - Any explanatory notes at the bottom`;

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
        }),
      });
      //console.log("Prompt", prompt);

      const data = await response.json();
      setGeneratedBio(
        data.response ||
          data.choices?.[0]?.text ||
          "Failed to generate bio. Please try again."
      );
      toast.success("Your bio is ready! ✨");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
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

  function handleTemplateClick(template: string) {
    setRole(template);
    setIsTemplateVisible(false);
  }

  const LanguageSelector = ({
    language,
    setLanguage,
  }: {
    language: string;
    setLanguage: (language: string) => void;
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

  const handleCardInteraction = (vibeOption: {
    name: string;
    description: string;
  }) => {
    setSelectedVibe(vibeOption.name);
    setVibe(vibeOption.name);
    setActiveHint(vibeOption.name);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <Card className="p-4 sm:p-6 md:p-8 shadow-lg border-2 border-indigo-100 bg-gradient-to-br from-indigo-100 to-white">
        <div className="space-y-4 sm:space-y-6">
          {/* Role Input with Templates */}
          <div className="space-y-2 relative">
            <Label
              htmlFor="role"
              className="text-base sm:text-lg font-semibold text-indigo-500 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              What's your role?
            </Label>
            <Input
              id="role"
              placeholder="e.g. Senior Software Engineer at Google. You can type or choose a template..."
              value={role}
              onFocus={() => setIsTemplateVisible(true)}
              onChange={(e) => setRole(e.target.value)} // Update the role as user types
              onBlur={() => setTimeout(() => setIsTemplateVisible(false), 200)} // Delay for click
              className="border-2 border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-offset-0 focus:border-transparent focus:shadow-lg focus:shadow-indigo-400/50 text-sm sm:text-base transition antialiased"
            />

            <AnimatePresence>
              {isTemplateVisible && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full mt-2 flex flex-wrap gap-2"
                >
                  {/* Filter templates based on user input */}
                  {shuffledTemplates
                    .filter(
                      (template) =>
                        template.toLowerCase().includes(role.toLowerCase()) // Case insensitive filtering
                    )
                    .map((template) => (
                      <div
                        key={template}
                        onClick={() => handleTemplateClick(template)}
                        className="px-2 py-1.5 bg-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-100 cursor-pointer text-xs sm:text-base whitespace-nowrap transition-all duration-200 antialiased"
                      >
                        {template}
                      </div>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Vibe Selection */}
          <div className="space-y-2">
            <Label className="text-base sm:text-lg font-semibold text-indigo-700">
              🎨 Choose your vibe
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {vibeOptions.map((vibeOption) => (
                <Card
                  key={vibeOption.name.toLowerCase()}
                  className={`relative p-3 cursor-pointer transition-all duration-200 hover:shadow-md group ${
                    selectedVibe === vibeOption.name
                      ? "border-2 border-indigo-500 bg-indigo-50"
                      : "border border-gray-200 hover:border-indigo-300"
                  }`}
                  onClick={() => handleCardInteraction(vibeOption)}
                  //onTouchStart={() => handleCardInteraction(vibeOption)}
                  onMouseEnter={() => setActiveHint(vibeOption.name)}
                  onMouseLeave={() => setActiveHint(null)}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-sm sm:text-base text-indigo-700 mb-1">
                        {vibeOption.name}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                      {vibeOption.description}
                    </p>

                    {/* Tooltip */}
                    {activeHint === vibeOption.name && (
                      <div className="absolute z-50 left-0 right-0 -bottom-2 transform translate-y-full mx-2">
                        <div className="bg-gray-900 text-white p-2 rounded-md text-xs shadow-lg">
                          {vibeOption.description}
                          <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45" />
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <AdditionalDetailsSection
            additionalContext={additionalContext}
            setAdditionalContext={setAdditionalContext}
            role={role}
            vibe={vibe}
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
                  animate={{ opacity: [1, 0.5, 1] }} // Smooth blinking effect
                  transition={{
                    duration: 1, // Total time for one blink cycle
                    repeat: Infinity, // Keep repeating
                    ease: "easeInOut", // Valid easing type
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

                {/* Render generatedBio with preserved line breaks using CSS */}
                <div
                  className="mt-2 sm:mt-4 min-h-[150px] sm:min-h-[200px] focus:ring-4 focus:ring-green-200 text-sm sm:text-base"
                  style={{
                    whiteSpace: "pre-line", // Ensures that line breaks are preserved
                  }}
                >
                  <div
                    className="mt-2 sm:mt-4 min-h-[150px] sm:min-h-[200px] prose prose-lg sm:prose-xl max-w-none antialiased text-gray-800 leading-relaxed font-sans"
                    dangerouslySetInnerHTML={{ __html: formattedBio }}
                  />
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className={`mt-4 w-full sm:w-auto flex items-center justify-center gap-4 p-3 rounded-lg transition-all duration-300 transform ${
                      isCopying
                        ? "border-green-600 bg-green-200 text-green-800 shadow-lg"
                        : "border-green-400 hover:border-green-600 hover:bg-green-50 text-green-500 hover:text-green-700"
                    } text-sm sm:text-base font-semibold cursor-pointer active:scale-95 hover:scale-105`}
                    onClick={handleCopy}
                    disabled={isCopying}
                  >
                    <motion.div
                      animate={
                        isCopying
                          ? { rotate: 360, scale: 1.3, y: [0, -10, 0] }
                          : { rotate: 0, scale: 1, y: 0 }
                      }
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                        duration: 0.5,
                      }}
                      className="flex items-center justify-center"
                    >
                      {isCopying ? (
                        <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
                      ) : (
                        <Copy className="h-5 w-5 sm:h-6 sm:w-6" />
                      )}
                    </motion.div>

                    <motion.span
                      animate={
                        isCopying
                          ? { opacity: 1, scale: 1.1 }
                          : { opacity: 0.9, scale: 1 }
                      }
                      transition={{ duration: 0.3 }}
                      className={`text-sm sm:text-base transition-all ${
                        isCopying ? "font-semibold text-green-800" : ""
                      }`}
                    >
                      {isCopying ? (
                        <motion.span
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ type: "spring", stiffness: 150 }}
                          className="inline-block"
                        >
                          Copied!
                        </motion.span>
                      ) : (
                        "Copy to Clipboard"
                      )}
                    </motion.span>
                  </Button>
                </motion.div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
