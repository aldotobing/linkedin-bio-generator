import "./globals.css";

export const metadata = {
  title: "LinkedIn Bio Generator",
  description:
    "Transform your professional story into an engaging LinkedIn bio",
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
