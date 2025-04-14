import { Readex_Pro } from "next/font/google";
import { Kaisei_Opti } from "next/font/google";
import "./globals.css";

const readexPro = Readex_Pro({
  variable: "--font-Readex-Pro",
  subsets: ["latin"],
  weight: ['200', '300', '400', '500', '600', '700'],
});

const kaiseiOpti = Kaisei_Opti({
  variable: "--font-Kaisei-Opti",
  subsets: ["latin"],
  weight: ['400', '500', '700'],
});

export const metadata = {
  title: "Studyfront",
  description: "Simple and powerful research tool for your studies",
};

export default function RootLayout({ children}) {
  return (
    <html lang="en">
      <body className={ readexPro.className + " " + kaiseiOpti.className + " " + 'bg-ice-blue'  }>
        {children}
      </body>
    </html>
  );
}