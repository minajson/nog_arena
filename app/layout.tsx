import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Header from "@/components/Header";
import RefreshRedirect from "@/components/RefreshRedirect";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "NOG Arena",
  description: "Conference mini-game arena — Nigeria Oil & Gas edition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-nog-black">
        <RefreshRedirect />
        <Header />
        {children}
      </body>
    </html>
  );
}
