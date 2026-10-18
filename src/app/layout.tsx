import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VELORA | Haute Édition",
  description: "Luxury Fashion & Lifestyle E-Commerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-[#FDFBF7] text-[#121212] antialiased">
        {children}
      </body>
    </html>
  );
}