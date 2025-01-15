import { Sparkles } from "lucide-react";
import { BioGenerator } from "./components/bio-generator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkedIn Bio Generator",
  description:
    "Transform your professional story into an engaging LinkedIn bio",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Powered by Llama 3.3 70B</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Craft Your Perfect LinkedIn Bio
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Transform your professional story into an engaging LinkedIn bio that
            captures attention and showcases your unique value.
          </p>
        </div>
        <BioGenerator />
      </div>
    </div>
  );
}
