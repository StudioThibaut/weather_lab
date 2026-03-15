import { AppToaster } from "@/components/ui/toast";
import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import Script from "next/script";
import GoogleAnalyticsTracker from "@/components/GoogleAnalyticsTracker";
import "./globals.css";

export const metadata = {
  title: "Weather Lab Kids",
  description: "Ontdek de wereld en het weer",
  // Cruciaal voor iPad: voorkomt verspringen en ongewenst zoomen
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className="h-full">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `}
        </Script>

        {/* DE ULTIEME IPAD & RESPONSIVE FIX */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* 1. Schaal alles omlaag op tablets/iPads zodat elementen niet uit de bocht vliegen */
          @media (max-width: 1200px) {
            html { font-size: 14px !important; }
          }
          
          @media (max-width: 1024px) {
            html { font-size: 13px !important; }
          }

          @media (max-width: 768px) {
            html { font-size: 12px !important; }
          }

          /* 2. Voorkom horizontale scroll-haperingen */
          body {
            overflow-x: hidden;
            width: 100%;
            -webkit-font-smoothing: antialiased;
            -webkit-tap-highlight-color: transparent;
          }

          /* 3. iPad Safari height fix: vult het hele scherm zonder adresbalk-clutter */
          .min-h-screen {
            min-height: 100vh;
            min-height: 100dvh;
          }

          /* 4. Maak interacties op touchscreens sneller */
          button, a {
            touch-action: manipulation;
          }
        `}} />
      </head>

      <body className="bg-slate-200 min-h-screen font-sans antialiased flex flex-col">
        <GoogleAnalyticsTracker />

        {/* DE HOOFDCONTAINER: 
          - Max-width zorgt dat het op een grote iPad/Desktop niet té breed wordt.
          - mx-auto centreert de boel.
          - flex-1 zorgt dat de main alle ruimte pakt.
        */}
        <div className="max-w-350 mx-auto bg-white shadow-2xl min-h-screen w-full relative flex flex-col border-x border-slate-200">
          
          {/* Navbar wrapper met hoge z-index */}
          <div className="z-100 relative">
            <GlobalNavbar />
          </div>

          {/* MAIN CONTENT:
            - overflow-x-hidden voorkomt dat animaties de iPad laten 'wiebelen'.
            - pt-16 (of vergelijkbaar) zorgt dat de content niet onder de navbar begint op mobiel.
          */}
          <main className="flex-1 relative w-full overflow-x-hidden pt-4 md:pt-0">
            {children}
          </main>

          {/* Footer blijft altijd onderaan de container */}
          <Footer />
        </div>

        <AppToaster />
      </body>
    </html>
  );
}