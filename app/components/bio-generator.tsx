"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, Sparkles, Copy } from "lucide-react";
import { toast } from "react-hot-toast";
import { marked } from "marked";
import ReactCountryFlag from "react-country-flag";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL || "";

const templates = [
  "Software Engineer",
  "Product Manager",
  "UX Designer",
  "Data Scientist",
  "DevOps Engineer",
  "Marketing Manager",
  "Graphic Designer",
  "Business Analyst",
  "Financial Analyst",
  "Auditor",
  "Architect",
  "Civil Engineer",
  "Mechanical Engineer",
  "HR Manager",
  "Sales Executive",
  "Operations Manager",
  "Project Manager",
  "Teacher",
  "Nurse",
  "Customer Service Representative",
];

const shuffleArray = (array: string[]) => {
  return array.sort(() => Math.random() - 0.5);
};

const shuffledTemplates = shuffleArray([...templates]);

const vibeOptions = [
  {
    name: "Professional",
    description:
      "Perfect for corporate roles, focuses on achievements and expertise",
  },
  {
    name: "Creative",
    description: "Ideal for designers, artists, and innovative roles",
  },
  {
    name: "Casual",
    description:
      "Friendly and approachable, great for startups and social media",
  },
  {
    name: "Enthusiastic",
    description:
      "Energetic and passionate, perfect for community-focused roles",
  },
  {
    name: "Technical",
    description:
      "Detailed and precise, ideal for technical and specialized roles",
  },
  {
    name: "Leadership",
    description: "Emphasizes vision and team management experience",
  },
];

export function BioGenerator() {
  const [role, setRole] = useState("");
  const [isTemplateVisible, setIsTemplateVisible] = useState(false);
  const [vibe, setVibe] = useState("professional");
  const [additionalContext, setAdditionalContext] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBio, setGeneratedBio] = useState("");
  const [isCopying, setIsCopying] = useState(false);
  const [language, setLanguage] = useState("en");

  async function generateBio() {
    if (!role) {
      toast.error("Please enter your role first!");
      return;
    }

    setIsGenerating(true);
    setGeneratedBio("");

    const prompt = `Create a compelling LinkedIn bio for a ${role}.
    Additional Context: ${additionalContext || "N/A"}
    Follow these guidelines:
    1. Style: Make it ${vibe}, engaging, and authentic.
    2. Structure:
      - Start with a powerful hook.
      - Highlight expertise, impact, and measurable achievements.
      - Include relevant technical skills.
      - Showcase passion and unique value proposition.
      - End with a strong call to action or future aspirations.
    3. Length: Keep it concise (2-3 short paragraphs).
    4. Tone: Confident but approachable.
    ${language === "id" ? "5. Make it in proper Indonesian language." : ""}
    6. Use first-person narrative.`;

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

      const data = await response.json();
      setGeneratedBio(
        data.response ||
          data.choices?.[0]?.text ||
          "Failed to generate bio. Please try again."
      );
      toast.success("Your bio is ready! ✨");
    } catch (error) {
      console.error("Error:", error);
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
      <div className="space-y-4">
        <Label className="text-base sm:text-lg font-semibold text-indigo-700">
          🌐 Choose Your Language
        </Label>

        <div className="flex justify-center gap-5">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
              language === "en"
                ? "border-2 border-blue-400"
                : "border-2 border-gray-200 hover:border-blue-300"
            }`}
            onClick={() => setLanguage("en")}
          >
            <div className="mb-2">
              <ReactCountryFlag
                countryCode="GB"
                svg
                cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                cdnSuffix="svg"
                title="GB"
                style={{ height: "25px", width: "50px" }}
              />
            </div>
            {language === "en" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 text-blue-500"
              ></motion.div>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
              language === "id"
                ? "border-2 border-red-400"
                : "border-2 border-gray-200 hover:border-red-300"
            }`}
            onClick={() => setLanguage("id")}
          >
            <div className="mb-2">
              <ReactCountryFlag
                countryCode="ID"
                svg
                cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                cdnSuffix="svg"
                title="ID"
                style={{ height: "25px", width: "50px" }}
              />
            </div>
            {language === "id" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 text-red-500"
              ></motion.div>
            )}
          </motion.button>
        </div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-gray-600 italic antialiased"
          >
            {language === "en"
              ? "Your bio will be written in English"
              : "Bio Anda akan ditulis dalam Bahasa Indonesia"}
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <Card className="p-4 sm:p-6 md:p-8 shadow-lg border-2 border-indigo-500 bg-gradient-to-br from-indigo-100 to-white">
        <div className="space-y-4 sm:space-y-6">
          {/* Role Input with Templates */}
          <div className="space-y-2 relative">
            <Label
              htmlFor="role"
              className="text-base sm:text-lg font-semibold text-indigo-700 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              What's your role?
            </Label>
            <Input
              id="role"
              placeholder="e.g. Senior Software Engineer at Google. You can type or choose a template..."
              value={role}
              onFocus={() => setIsTemplateVisible(true)}
              onChange={(e) => setRole(e.target.value)}
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
                  {shuffledTemplates.map((template) => (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {vibeOptions.map((vibeOption) => (
                <Card
                  key={vibeOption.name.toLowerCase()}
                  className={`p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    vibe === vibeOption.name.toLowerCase()
                      ? "border-2 border-indigo-500 bg-indigo-50"
                      : "border border-gray-200 hover:border-indigo-300"
                  }`}
                  onClick={() => setVibe(vibeOption.name.toLowerCase())}
                >
                  <div className="flex flex-col h-full">
                    <h3 className="font-semibold text-sm sm:text-base text-indigo-700 mb-1">
                      {vibeOption.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                      {vibeOption.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-2">
            <Label
              htmlFor="additionalContext"
              className="text-base sm:text-lg font-semibold text-indigo-700"
            >
              📝 Additional details
            </Label>
            <Textarea
              id="additionalContext"
              placeholder="Share your achievements, passions, or specific skills..."
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              className="border-2 border-indigo-300 focus:ring-4 focus:ring-indigo-200 min-h-[100px] focus:border-transparent text-sm sm:text-base"
            />
          </div>

          {/* Language Selection */}
          <LanguageSelector language={language} setLanguage={setLanguage} />

          {/* Generate Button */}
          <Button
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-purple-500 hover:to-indigo-500 shadow-md text-sm sm:text-base transition-all duration-300"
            size="lg"
            onClick={generateBio}
            disabled={!role || isGenerating}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm sm:text-base">
                  Crafting your bio...
                </span>
              </div>
            ) : (
              <span className="text-sm sm:text-base">Generate Bio ✨</span>
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
                    className="mt-2 sm:mt-4 min-h-[150px] sm:min-h-[200px] prose prose-sm sm:prose-base max-w-none"
                    dangerouslySetInnerHTML={{ __html: formattedBio }}
                  />
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className={`mt-4 w-full sm:w-auto flex items-center justify-center gap-2 ${
                      isCopying
                        ? "border-green-500 bg-green-100 text-green-700"
                        : "border-green-400 hover:bg-green-100"
                    } text-sm sm:text-base transition-all duration-300`}
                    onClick={handleCopy}
                    disabled={isCopying}
                  >
                    <motion.div
                      animate={isCopying ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {isCopying ? (
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </motion.div>
                    {isCopying ? "Copied!" : "Copy to Clipboard"}
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
