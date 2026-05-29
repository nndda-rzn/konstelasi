import type { Metadata } from "next";
import { Inter, Geist_Mono, Caveat, Dancing_Script, Playfair_Display, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Konstelasi — Visual Node-Based Diary",
  description: "A beautiful visual diary that lets you connect your thoughts like constellations in the sky.",
};

import { ApolloWrapper } from "@/lib/apollo/ApolloWrapper";
import { ToasterProvider } from "@/lib/toast/ToasterProvider";
import { Providers } from "@/lib/Providers";
import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} ${caveat.variable} ${dancingScript.variable} ${playfair.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
        <ThemeProvider>
          <ApolloWrapper>
            <Providers>{children}</Providers>
          </ApolloWrapper>
          <ToasterProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
