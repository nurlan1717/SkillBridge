import type { Metadata } from "next";
import { Manrope, Syne, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillBridge AI",
  description:
    "SkillBridge AI turns learning into verified skill proof and job-ready outcomes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${syne.variable} ${jetBrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[var(--bg)] text-[var(--text)]">
        <AuthProvider>
          <Toaster position="top-center" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
