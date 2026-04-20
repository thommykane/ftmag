import type { Metadata } from "next";
import { Cormorant_Garamond, Electrolize } from "next/font/google";
import "./globals.css";

const electrolize = Electrolize({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-electrolize",
});

const display = Cormorant_Garamond({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Food & Travel Magazine",
  description: "Eat. Stay. Explore.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${electrolize.variable} ${display.variable}`}>
      <body className="font-electrolize min-h-screen bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
