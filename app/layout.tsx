import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "@/styles/globals.css";
import React from "react";
import {ThemeProvider} from "@/components/theme-provider";
import {Navbar} from "@/components/navbar/navbar";
import {SessionProvider} from "next-auth/react";

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
                className="w-full h-[calc(100dvh-4rem)] mx-auto rounded-md overflow-hidden flex flex-col justify-center items-center">

              {children}

            </div>

          </ThemeProvider>

        </SessionProvider>

      </body>
    </html>
  );
}
