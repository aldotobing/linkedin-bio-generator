import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinkedIn Bio Generator",
  description:
    "Craft Your Perfect LinkedIn Bio,  \
  Transform your professional story into an engaging LinkedIn bio that captures attention and showcases your unique value.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
