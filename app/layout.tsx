import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "@/styles/globals.css";
import React from "react";
import {ThemeProvider} from "@/components/theme-provider";
import {Navbar} from "@/components/navbar/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "mathAi",
  description: "Work in progress!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar/>

          {children}

        </ThemeProvider>

      </body>
    </html>
  );
}
