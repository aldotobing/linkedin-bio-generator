import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, Copy } from "lucide-react";

interface CopyToClipboardButtonProps {
  isCopying: boolean;
  handleCopy: () => void;
  className?: string;
}

const CopyToClipboardButton = ({
  isCopying,
  handleCopy,
  className = "",
}: CopyToClipboardButtonProps) => {
  return (
    <Button
      variant="outline"
      className={`w-full sm:w-auto flex items-center justify-center gap-4 p-3 h-12 rounded-lg transition-all duration-300 transform ${
        isCopying
          ? "border-green-600 bg-green-200 text-green-800 shadow-lg"
          : "border-green-400 hover:border-green-600 hover:bg-green-50 text-green-500 hover:text-green-700"
      } text-sm sm:text-base font-semibold cursor-pointer active:scale-95 hover:scale-105 ${className}`}
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
          isCopying ? { opacity: 1, scale: 1.1 } : { opacity: 0.9, scale: 1 }
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
  );
};

export default CopyToClipboardButton;
