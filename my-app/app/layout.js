import { Sora } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";
import { getContent } from "@/lib/content";
import { areAllSectionsHidden } from "@/lib/sectionVisibility";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Artha Mitra Interdata",
  description: "IT Solutions Integrator and Provider. We partner with you in managing IT infrastructure and security by optimizing its efficiency.",
};

/**
 * Map nav hrefs to their data file names so we can check section visibility.
 * Pages not listed here (e.g. /contact) are always shown.
 */
const NAV_HREF_TO_FILE = {
  '/about': 'about',
  '/solution': 'solution',
  '/products': 'products',
  '/activities': 'activities',
  '/insight': 'insight',
};

export default function RootLayout({ children }) {
  const global = getContent('global');

  // Filter out nav items whose pages have ALL sections hidden
  const filteredNav = global.nav.filter((item) => {
    const fileName = NAV_HREF_TO_FILE[item.href];
    if (!fileName) return true; // unknown pages stay visible
    const pageData = getContent(fileName);
    return !areAllSectionsHidden(pageData);
  });

  const filteredGlobal = { ...global, nav: filteredNav };

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${sora.className} antialiased`}>
        <LayoutShell globalData={filteredGlobal}>{children}</LayoutShell>
      </body>
    </html>
  );
}