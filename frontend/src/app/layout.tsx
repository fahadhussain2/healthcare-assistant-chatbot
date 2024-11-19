import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";

const geistSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Healthcare Assistant",
  description: "AI Powered Healthcare Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("env", process.env)
  return (
    <html lang="en">
      <UserProvider>
        <body className={`${geistSans.variable} font-sans antialiased`}>{children}</body>
      </UserProvider>
    </html>
  );
}
