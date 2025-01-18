"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { vibeOptions } from "./VibeOptions"; // Ensure this imports correctly
import { useState } from "react";

interface VibeSelectorProps {
  selectedVibe: string;
  setVibe: (vibe: string) => void;
  setActiveHint: (vibe: string | null) => void;
  setSelectedVibe: (vibe: string) => void;
}

export function VibeSelector({
  selectedVibe,
  setVibe,
  setActiveHint,
  setSelectedVibe,
}: VibeSelectorProps) {
  const handleCardInteraction = (vibeOption: {
    name: string;
    description: string;
  }) => {
    setSelectedVibe(vibeOption.name);
    setVibe(vibeOption.name);
    setActiveHint(vibeOption.name);
  };

  return (
    <div className="space-y-2">
      <Label className="text-base sm:text-md font-semibold text-indigo-700">
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
            onMouseEnter={() => setActiveHint(vibeOption.name)}
            onMouseLeave={() => setActiveHint(null)}
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {vibeOption.icon}
                  <h3 className="font-semibold text-sm sm:text-base text-indigo-700 mb-1">
                    {vibeOption.name}
                  </h3>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                {vibeOption.description}
              </p>

              {/* Tooltip */}
              {selectedVibe === vibeOption.name && (
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
  );
}
