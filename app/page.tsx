import { Sparkles } from "lucide-react";
import { BioGenerator } from "./components/bio-generator";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "LinkedIn Bio Generator",
  description:
    "Transform your professional story into an engaging LinkedIn bio",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Craft Your Perfect LinkedIn Bio
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Transform your professional story into an engaging LinkedIn bio that
            captures attention and showcases your unique value.
          </p>

          <div className="flex justify-center items-center gap-2 px-6 py-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 mb-8 max-w-fit mx-auto">
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-base">
                <b>Powered by Llama3.3 70B (Instruct FP8 Fast)</b>
              </span>
            </div>
            <div className="relative">
              <Image
                src="/linkedin-bio-generator/assets/img/meta.png"
                alt="Meta"
                width={50}
                height={50}
                className="transition-transform hover:scale-110"
              />
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs py-1 px-2 rounded">
                Meta
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <BioGenerator />
        </div>
      </div>

      {/* Footer Section with same background */}
      <footer className="bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 py-4 mt-12">
        <div className="container max-w-4xl mx-auto text-center">
          <hr className="border-gray-300 dark:border-gray-700 mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Crafted with love by{" "}
            <span className="font-semibold">Aldo Tobing</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
