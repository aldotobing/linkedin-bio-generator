"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";

interface AdditionalDetailsSectionProps {
  additionalContext: string;
  setAdditionalContext: (value: string) => void;
  role: string;
  vibe: string;
  roleRef: React.RefObject<HTMLElement>;
}

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL || "";

const AdditionalDetailsSection: React.FC<AdditionalDetailsSectionProps> = ({
  additionalContext,
  setAdditionalContext,
  role,
  vibe,
  roleRef,
}) => {
  const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleHighlight = () => {
    if (roleRef?.current) {
      // First, scroll the element into view
      roleRef.current.scrollIntoView({ behavior: "smooth", block: "center" });

      // Add highlight effect
      roleRef.current.classList.add(
        "ring-4",
        "ring-red-300",
        "transition-all",
        "duration-500"
      );

      // Optional: Add focus to the input
      if (roleRef.current instanceof HTMLInputElement) {
        roleRef.current.focus();
      }

      // Remove highlight after animation
      setTimeout(() => {
        if (roleRef.current) {
          roleRef.current.classList.remove("ring-4", "ring-red-300");
        }
      }, 2000);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Add a small delay to ensure the modal is fully closed before scrolling
    setTimeout(() => {
      handleHighlight();
    }, 100);
  };

  async function generateDetailsTemplate() {
    if (!role) {
      setIsModalOpen(true);
      return;
    }

    setAdditionalContext("✨ Generating an awesome example... hang tight! ✨");
    setIsGeneratingTemplate(true);

    const prompt = `
You are tasked with generating a concise example for the "Additional Context/Details" section of a LinkedIn bio. 
The example should focus exclusively on the user's key achievements, passions, or specific skills related to their role as "${role}". 
 Highlight the most important details without unnecessary storytelling or filler.

Include:
1. One or two notable achievements. (no measure in numbers)
2. Specific areas of expertise or passion.

Avoid:
   - Generic buzzwords and clichés
   - Personal information unrelated to career
   - Overly formal or casual language
   - Translation notes or word/character counts
   - Any explanatory notes at the bottom

Keep the response brief, impactful, and clear, and ensure it is ready for use without placeholders or notes, using a first-person narrative voice.
`;

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          type: "additional",
        }),
      });

      //   console.log("generate prompt :", prompt);

      const data = await response.json();
      const template =
        data.response?.trim() ||
        data.choices?.[0]?.text?.trim() ||
        "Failed to generate template.";
      setAdditionalContext(template);
      toast.success("Template generated! ✨");
    } catch (error) {
      toast.error("Failed to generate template. Please try again.");
      setAdditionalContext("");
    } finally {
      setIsGeneratingTemplate(false);
    }
  }

  const handleButtonClick = () => {
    if (!role) {
      setIsModalOpen(true);
    } else {
      generateDetailsTemplate();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label
          htmlFor="additionalContext"
          className="text-base sm:text-md font-semibold text-indigo-700"
        >
          📝 Additional details
        </Label>
        <Button
          variant="outline"
          size="sm"
          onClick={handleButtonClick}
          className="flex items-center gap-2 text-indigo-600 border-indigo-300 hover:bg-indigo-50"
        >
          {isGeneratingTemplate ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Sparkles className="h-3 w-3" />
          )}
          <span className="text-sm">
            {isGeneratingTemplate ? "Generating..." : "Get Example"}
          </span>
        </Button>
      </div>
      <Textarea
        id="additionalContext"
        placeholder="Share your achievements, passions, or specific skills... (Optional)"
        value={additionalContext}
        onChange={(e) => setAdditionalContext(e.target.value)}
        className="border-2 border-indigo-300 focus:ring-4 focus:ring-indigo-200 min-h-[100px] focus:border-transparent text-sm sm:text-base"
      />
      <p className="text-[10px] text-gray-600 mt-2 antialiased">
        <span className="mr-1">ℹ</span>
        You can click the "<b>Get Example</b>" button to generate a template,
        which you can customize as needed.
      </p>

      {/* Modal Dialog with Smooth iOS-like Paralax Effect */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div
            className="bg-white bg-opacity-90 p-6 rounded-xl shadow-xl max-w-md w-full transition-transform transform scale-95 ease-out duration-500 opacity-0 animate-fadeIn"
            style={{
              animation: "fadeIn 0.5s ease-out forwards",
            }}
          >
            <h3 className="text-lg font-semibold text-red-500">Oops</h3>
            <p className="text-sm text-gray-800 mt-2">
              Please select your role before generating the example.
            </p>
            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCloseModal}
                className="text-gray-600 border-gray-300 hover:bg-gray-100 hover:text-gray-800"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdditionalDetailsSection;
