import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
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
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
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
