import {  Sora } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";
import { getContent } from "@/lib/content";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});


export const metadata = {
  title: "Artha Mitra Interdata",
  description: "IT Solutions Integrator and Provider. We partner with you in managing IT infrastructure and security by optimizing its efficiency.",
};

export default function RootLayout({ children }) {
  const global = getContent('global');

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${sora.className} antialiased`}>
        <LayoutShell globalData={global}>{children}</LayoutShell>
      </body>
    </html>
  );
}
