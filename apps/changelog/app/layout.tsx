import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import "@ui/styles/globals.css";
import "./markdown.css";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Follow up on the latest improvements and updates.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
    >
      <body className="min-h-screen w-screen bg-neutral-50 p-2 md:pt-8">
        {children}
      </body>
    </html>
  );
}
