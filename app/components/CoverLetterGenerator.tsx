import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  UserCircle,
  Building2,
  ClipboardCopy,
  Loader2,
  Download,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { CoverLetterForm } from "./CoverLetterForm";
import { motion, AnimatePresence } from "framer-motion";

interface CoverLetterGeneratorProps {
  bioContext: string;
  role: string;
  vibe: string;
  language: string;
  className?: string;
}

export function CoverLetterGenerator({
  bioContext,
  role,
  vibe,
  language,
}: CoverLetterGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState<any>(null); // Store form state here

  const handleGeneration = async (coverLetter: string) => {
    setIsGenerating(true);
    setGeneratedCoverLetter("");

    // Simulate typing effect
    for (let i = 0; i < coverLetter.length; i++) {
      setGeneratedCoverLetter((prev) => prev + coverLetter[i]);
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    setIsGenerating(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      generatedCoverLetter.replace(/<[^>]+>/g, "")
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsPDF = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedCoverLetter.replace(/<[^>]+>/g, "")], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "cover-letter.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // This handles the dialog close without clearing form data
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    // Only clear generated letter when closing
    if (!open) {
      setGeneratedCoverLetter("");
    }
    // Do not reset formState here
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="group ml-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        <UserCircle className="z-10" size={20} />
        <span className="z-10">Create Cover Letter</span>
        <Sparkles className="z-10 ml-1 animate-pulse" size={16} />
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-violet-50 to-white shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-violet-700 flex items-center gap-2">
              <Building2 className="animate-bounce" size={24} />
              Professional Cover Letter Generator
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Create a compelling cover letter tailored to your profile and
              role.
            </DialogDescription>
          </DialogHeader>

          <CoverLetterForm
            bioContext={bioContext}
            role={role}
            language={language}
            onGenerate={handleGeneration}
            formState={formState} // Pass the persisted form state
            onFormStateChange={setFormState} // Update the form state
          />

          <AnimatePresence>
            {generatedCoverLetter && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 space-y-4"
              >
                <Label className="text-xl font-semibold text-green-700 flex items-center gap-2">
                  Your Professional Cover Letter
                  {isGenerating && (
                    <Loader2 className="animate-spin" size={20} />
                  )}
                </Label>
                <div className="mt-2 p-6 border rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: generatedCoverLetter }}
                  />
                </div>
                <div className="flex gap-4 mt-4 justify-end">
                  <Button
                    onClick={() => handleGeneration(generatedCoverLetter)}
                    className="bg-violet-500 text-white hover:bg-violet-600 flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <RefreshCw size={18} />
                    Regenerate
                  </Button>
                  <Button
                    onClick={handleCopy}
                    className="bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <ClipboardCopy size={18} />
                    {copied ? "Copied!" : "Copy to Clipboard"}
                  </Button>
                  <Button
                    onClick={downloadAsPDF}
                    className="bg-green-500 text-white hover:bg-green-600 flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <Download size={18} />
                    Download
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}
