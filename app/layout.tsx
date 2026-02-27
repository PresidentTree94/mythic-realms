import type { Metadata } from "next";
import { Lato, Cinzel } from "next/font/google";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mythic Realms",
  description: "A website for organizing kingdoms and characters inspired by real medieval kingdoms and Greek mythology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${lato.variable} antialiased`}>
        <div className="before:content-[''] before:fixed before:inset-0 before:bg-[url('/hero.png')] before:bg-cover before:bg-center before:opacity-20 before:-z-1"></div>
        {children}
      </body>
    </html>
  );
}
