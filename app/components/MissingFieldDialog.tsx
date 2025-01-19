import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react"; // Import an icon
import { motion } from "framer-motion"; // For animations

interface MissingFieldDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  missingField: string;
}

export function MissingFieldDialog({
  isOpen,
  onOpenChange,
  missingField,
}: MissingFieldDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-purple-50 to-blue-50 shadow-2xl rounded-lg border-0">
        {/* Animated Dialog Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} // Fade in and slide up
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <DialogHeader>
            {/* Icon and Title */}
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="w-12 h-12 text-purple-600" /> {/* Icon */}
              <DialogTitle className="text-1xl font-bold text-purple-800">
                Oops! Something's Missing 🛠️
              </DialogTitle>
            </div>

            {/* Description */}
            <DialogDescription className="mt-4 text-center text-gray-600">
              To proceed, please fill in the{" "}
              <strong className="text-purple-600">{missingField}</strong> field.
            </DialogDescription>
          </DialogHeader>

          {/* Button */}
          <Button
            onClick={() => onOpenChange(false)}
            className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg transition-all duration-300 hover:scale-105"
          >
            Got it!
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
