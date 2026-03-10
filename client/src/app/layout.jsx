import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CheckoutProvider } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ecoyaan Checkout Flow",
  description: "SSR checkout flow assignment built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CheckoutProvider>{children}</CheckoutProvider>
      </body>
    </html>
  );
}
