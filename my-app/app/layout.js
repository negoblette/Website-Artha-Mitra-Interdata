import { Geist, Geist_Mono, Alegreya_Sans } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";
import { getContent } from "@/lib/content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const alegreyaSans = Alegreya_Sans({
  variable: "--font-alegreya-sans",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const metadata = {
  title: "Artha Mitra Interdata - We Optimize IT for You",
  description: "IT Solutions Integrator and Provider. We partner with you in managing IT infrastructure and security by optimizing its efficiency.",
};

export default function RootLayout({ children }) {
  const global = getContent('global');

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${alegreyaSans.variable} antialiased`}>
        <LayoutShell globalData={global}>{children}</LayoutShell>
      </body>
    </html>
  );
}
