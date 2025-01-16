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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 font-sans antialiased">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Craft Your Perfect LinkedIn Bio
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Transform your professional story into an engaging LinkedIn bio that
            captures attention and showcases your unique value.
          </p>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 px-6 py-2.5 mb-0 rounded-full bg-purple-100 dark:bg-purple-900/30">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-300" />
              <span className="text-lg text-purple-600 dark:text-purple-300">
                Powered by Llama-3.3 70B
              </span>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Image
                src="/linkedin-bio-generator/assets/img/meta.png"
                alt="Meta"
                width={80}
                height={40}
                className="object-contain"
              />
              <Image
                src="/linkedin-bio-generator/assets/img/cloudflare.png"
                alt="Cloudflare"
                width={69}
                height={40}
                className="object-contain"
              />
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
