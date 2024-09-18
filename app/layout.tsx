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

          <div
              className="w-full mx-auto rounded-md  h-screen overflow-hidden flex flex-col justify-center items-center">

            <h1 className="md:text-6xl text-4xl font-bold text-center py-6">mathAi</h1>

            {children}

          </div>

        </ThemeProvider>

      </body>
    </html>
  );
}
