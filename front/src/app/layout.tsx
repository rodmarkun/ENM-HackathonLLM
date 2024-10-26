import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import "./globals.css";

const font = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nerdevs Customer Support",
  description: "An AI automatized site to help companies with client's tickets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>{children}</body>
    </html>
  );
}
