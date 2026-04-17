import { Geist, Geist_Mono, Alegreya_Sans, Sora, DM_Sans } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";
import { getContent } from "@/lib/content";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

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
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} ${alegreyaSans.variable} ${sora.variable} ${dmSans.variable} antialiased`}>
        <LayoutShell globalData={global}>{children}</LayoutShell>
      </body>
    </html>
  );
}
