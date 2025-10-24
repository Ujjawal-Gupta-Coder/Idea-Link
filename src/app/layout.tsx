import type { Metadata } from "next";
import localFont from 'next/font/local'
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import Navbar from "@/components/Navbar";
import { SanityLive } from "@/sanity/lib/live";

const workSans = localFont({
  src: [
    {
      path: "./fonts/WorkSans-black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/WorkSans-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/WorkSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/WorkSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/WorkSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/WorkSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/WorkSans-Thin.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/WorkSans-Light.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/WorkSans-ExtraLight.ttf",
      weight: "100",
      style: "normal",
    },
  ],
  variable: "--font-work-sans",
});

const cursive = localFont({
  src: [
    {
      path: "./fonts/Cursive-Regular.ttf",
      weight: "400",
      style: "normal",
    }
  ],
  variable: "--font-cursive",
});

export const metadata: Metadata = {
  title: "IdeaLink | Pitch and Grow Stratup",
  description: "This app connect inovators with investors to grow their startup",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${workSans.variable} ${cursive.variable}`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
            <SanityLive />
          </ThemeProvider>
      </body>

      
    </html>
  );
}
