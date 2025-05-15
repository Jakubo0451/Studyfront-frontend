import { Readex_Pro } from "next/font/google";
import { Frank_Ruhl_Libre } from "next/font/google";
import "./globals.css";

const readexPro = Readex_Pro({
  variable: "--font-Readex-Pro",
  subsets: ["latin"],
  weight: ['200', '300', '400', '500', '600', '700'],
});

const frankRuhlLibre = Frank_Ruhl_Libre({
  variable: "--font-Frank-Ruhl-Libre",
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata = {
  title: "Studyfront",
  description: "Simple and powerful research tool for your studies",
};

export default function RootLayout({ children}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo/logo.png" />
        <meta name="description" content="Simple and powerful research tool for your studies" />
        <meta name="keywords" content="Studyfront, research, study, tool" />
        <meta name="author" content="Group 5" />
        <meta name="theme-color" content="#29353C" />
        <link rel="apple-touch-icon" href="/logo/logo.png" />
      </head>
      <body className={ readexPro.className + " " + frankRuhlLibre.className + " " + 'bg-ice-blue'  }>
        {children}
      </body>
    </html>
  );
}