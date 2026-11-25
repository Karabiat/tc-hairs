import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tchairs.example.com"),
  title: {
    default: "T&C Hairs — Luxury Wigs & Hair Extensions",
    template: "%s — T&C Hairs",
  },
  description:
    "The Crown Edit. Hand-finished HD lace wigs and cuticle-aligned extensions, made to be lived in. Virgin Remy hair, atelier craftsmanship, undetectable hairlines.",
  keywords: [
    "luxury wigs",
    "hair extensions",
    "HD lace wig",
    "virgin remy hair",
    "clip-in extensions",
    "T&C Hairs",
  ],
  openGraph: {
    title: "T&C Hairs — Luxury Wigs & Hair Extensions",
    description:
      "Hand-finished HD lace wigs and cuticle-aligned extensions. Your crown. Your rules.",
    type: "website",
    images: [{ url: "/images/hero-editorial.jpg", width: 1200, height: 1500 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "T&C Hairs — Luxury Wigs & Hair Extensions",
    description: "The Crown Edit. Made to be lived in.",
    images: ["/images/hero-editorial.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#1B1412",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-ink text-bone grain">
        <a
          href="#main"
          className="fixed left-4 top-4 z-[300] -translate-y-24 rounded-full bg-orange px-5 py-3 text-xs font-semibold tracking-[0.08em] text-ink transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <CartProvider>
          <Cursor />
          <Header />
          <main id="main" className="relative">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
