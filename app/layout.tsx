import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio News Monitor",
  description: "Täglicher News-Überblick für dein Aktienportfolio.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="font-sans">{children}</body>
    </html>
  );
}
