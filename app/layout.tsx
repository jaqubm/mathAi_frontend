import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "@/styles/globals.css";
import React from "react";
import {ThemeProvider} from "@/components/theme-provider";
import {Navbar} from "@/components/navbar/navbar";
import {SessionProvider} from "next-auth/react";
import {Toaster} from "@/components/ui/toaster"

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

        <SessionProvider>

          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
          >

            <Navbar/>

            <div
                className="w-full min-h-[calc(100dvh-4rem)] mx-auto rounded-md overflow-hidden flex flex-col justify-center items-center">

              {children}

            </div>

            <Toaster />

          </ThemeProvider>

        </SessionProvider>

      </body>
    </html>
  );
}
