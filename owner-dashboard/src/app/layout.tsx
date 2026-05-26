import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GymOS Myanmar — Manager Dashboard",
  description:
    "AI-powered gym management platform for Myanmar. Monitor revenue, churn risk, trainer performance, and member activity in real time.",
  keywords: ["gym management", "myanmar", "fitness", "AI", "churn prediction"],
  openGraph: {
    title: "GymOS Myanmar — Manager Dashboard",
    description: "AI-powered gym management for Myanmar fitness businesses",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
