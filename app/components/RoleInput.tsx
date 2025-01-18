// RoleInput.tsx

import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { templates } from "./TemplateOptions";

interface RoleInputProps {
  role: string;
  setRole: (value: string) => void;
  isTemplateVisible: boolean;
  setIsTemplateVisible: (value: boolean) => void;
  handleTemplateClick: (template: string) => void;
  roleRef: React.RefObject<HTMLInputElement>;
}

const RoleInput: FC<RoleInputProps> = ({
  role,
  setRole,
  isTemplateVisible,
  setIsTemplateVisible,
  handleTemplateClick,
  roleRef,
}) => {
  const shuffledTemplates = templates.sort(() => Math.random() - 0.5); // Shuffle templates

  return (
    <div className="space-y-2 relative">
      <Label
        htmlFor="role"
        className="text-base sm:text-md font-semibold text-indigo-500 flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
        What's your role?
      </Label>
      <Input
        ref={roleRef}
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
              .filter((template) =>
                template.toLowerCase().includes(role.toLowerCase())
              ) // Case insensitive filtering
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
  );
};

export default RoleInput;
