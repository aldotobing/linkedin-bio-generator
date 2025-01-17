"use client"; // Add this line at the top to mark this file as a Client Component

import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { BioGenerator } from "./components/bio-generator";
import Image from "next/image";

const Page = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set state to true once the component mounts
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 font-sans antialiased relative overflow-hidden">
      {/* Background particles effect, only on client-side */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-purple-300/20 dark:bg-purple-600/10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                animation: `float ${Math.random() * 10 + 15}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="container max-w-4xl mx-auto px-4 py-8 relative">
        <div className="mt-5 text-center mb-12 opacity-0 animate-fade-in">
          <h1 className="text-2xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-4 hover:scale-105 transition-transform duration-300">
            Craft Your Perfect LinkedIn Bio
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-8 transform hover:translate-y-1 transition-transform duration-300">
            Transform your professional story into an engaging LinkedIn bio that
            captures attention and showcases your unique value.
          </p>

          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-200 dark:bg-purple-900/30">
              <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-300 animate-pulse" />
              <span className="text-lg text-purple-600 dark:text-purple-300">
                Powered by Llama-3.3 70B
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 opacity-0 animate-slide-up">
              <div className="flex items-center justify-center">
                <Image
                  src="/assets/img/meta.png"
                  alt="Meta"
                  width={100}
                  height={100}
                  className="object-contain hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="-mt-3 flex items-center justify-center">
                <Image
                  src="/assets/img/cloudflare.png"
                  alt="Cloudflare"
                  width={100}
                  height={100}
                  className="object-contain hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="-mt-10 opacity-0 animate-fade-in-delayed">
          <BioGenerator />
        </div>
      </div>

      <footer className="bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 py-4 mt-12">
        <div className="container max-w-4xl mx-auto text-center">
          <hr className="border-gray-300 dark:border-gray-700 mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300 transition-colors duration-300">
            Crafted with love by{" "}
            <span className="font-semibold">Aldo Tobing</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Page;
