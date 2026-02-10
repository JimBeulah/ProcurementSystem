import type { Metadata } from "next";
import { Inter, Outfit, Poppins, Open_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins"
});
const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans"
});

export const metadata: Metadata = {
  title: "Procurement System",
  description: "Enterprise Procurement & Finance",
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} ${poppins.variable} ${openSans.variable} font-body bg-background text-foreground selection:bg-blue-500/30 selection:text-blue-200`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
