import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal Bio Generator",
  description:
    "Transform your professional story into an engaging bio that captures attention and showcases your unique value on LinkedIn, your personal website, or portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
