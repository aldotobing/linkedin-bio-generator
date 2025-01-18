"use client";

import React, { useState } from "react";
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
}

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL || "";

const AdditionalDetailsSection: React.FC<AdditionalDetailsSectionProps> = ({
  additionalContext,
  setAdditionalContext,
  role,
  vibe,
}) => {
  const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);

  async function generateDetailsTemplate() {
    if (!role) {
      toast.error("Please enter your role first!");
      return;
    }

    setAdditionalContext("✨ Generating an awesome example... hang tight! ✨");

    setIsGeneratingTemplate(true);

    const prompt = `
You are tasked with generating a concise example for the "Additional Context/Details" section of a LinkedIn bio. 
The example should reflect the user's provided role as "${role}".

Your response must focus on the most important points, including:
1. One or two key achievements with metrics.
2. A notable project or initiative.
3. Core skills or expertise.

Avoid:
   - Generic buzzwords and clichés
   - Personal information unrelated to career
   - Overly formal or casual language
   - Translation notes or word/character counts
   - Any explanatory notes at the bottom

Keep the response brief, impactful, and ready for use without placeholders 
or notes, and voice type as first-person narrative.
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

      //   console.log("template :", prompt);

      const data = await response.json();
      const template =
        data.response ||
        data.choices?.[0]?.text ||
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
          onClick={generateDetailsTemplate}
          disabled={isGeneratingTemplate || !role}
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
        placeholder="Share your achievements, passions, or specific skills..."
        value={additionalContext}
        onChange={(e) => setAdditionalContext(e.target.value)}
        className="border-2 border-indigo-300 focus:ring-4 focus:ring-indigo-200 min-h-[100px] focus:border-transparent text-sm sm:text-base"
      />
    </div>
  );
};

export default AdditionalDetailsSection;
