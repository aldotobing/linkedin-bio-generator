"use client";
import { useRef, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { vibeOptions } from "./VibeOptions";

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
  const [truncatedDescriptions, setTruncatedDescriptions] = useState<
    Record<string, boolean>
  >({});
  const [showTooltip, setShowTooltip] = useState(true);
  const descriptionRefs = useRef<Record<string, HTMLParagraphElement | null>>(
    {}
  );

  const isTextTruncated = (element: HTMLElement) => {
    return element.scrollHeight > element.clientHeight;
  };

  const setDescriptionRef =
    (name: string) => (el: HTMLParagraphElement | null) => {
      descriptionRefs.current[name] = el;
    };

  useEffect(() => {
    const checkTruncation = () => {
      const newTruncatedState: Record<string, boolean> = {};
      vibeOptions.forEach((option) => {
        const element = descriptionRefs.current[option.name];
        if (element) {
          newTruncatedState[option.name] = isTextTruncated(element);
        }
      });
      setTruncatedDescriptions(newTruncatedState);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest(".vibe-card")) {
        setShowTooltip(false);
      }
    };

    checkTruncation();

    setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    window.addEventListener("resize", checkTruncation);

    return () => {
      window.removeEventListener("resize", checkTruncation);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleCardInteraction = (
    vibeOption: { name: string; description: string },
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setSelectedVibe(vibeOption.name);
    setVibe(vibeOption.name);
    setActiveHint(vibeOption.name);
    setShowTooltip(true);
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
            className={`relative p-3 cursor-pointer transition-all duration-200 hover:shadow-md group vibe-card ${
              selectedVibe === vibeOption.name
                ? "border-2 border-indigo-500 bg-indigo-50"
                : "border border-gray-200 hover:border-indigo-300"
            }`}
            onClick={(e) => handleCardInteraction(vibeOption, e)}
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
              <p
                ref={setDescriptionRef(vibeOption.name)}
                className="text-xs sm:text-sm text-gray-600 line-clamp-2"
              >
                {vibeOption.description}
              </p>

              {selectedVibe === vibeOption.name &&
                truncatedDescriptions[vibeOption.name] &&
                showTooltip && (
                  <div
                    className="absolute z-50 left-0 right-0 -bottom-2 transform translate-y-full mx-2"
                    onClick={(e) => e.stopPropagation()}
                  >
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

export default VibeSelector;
