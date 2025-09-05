
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Dancing_Script } from 'next/font/google'
import { TranslationProvider } from '../contexts/TranslationContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const dancing = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '700'], // adjust weights as needed
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata = {
  title: "KW Saudi Arabia - Real Estate",
  description: "Keller Williams Saudi Arabia - Your trusted real estate partner",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} language-transition`}>
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}





