import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Great_Vibes,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400", "500", "600"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Нұрлан & Тоқжан | Той шақыруы",
  description: "Нұрлан мен Тоқжанның үйлену тойына арналған онлайн шақыру",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kk">
      <body
        className={`${playfair.variable} ${cormorant.variable} ${greatVibes.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
