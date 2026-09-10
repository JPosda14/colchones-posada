import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.colchonesposada.lat"),
  title: {
    default: "Colchones Posada | Fábrica de colchones en Armenia, Quindío",
    template: "%s | Colchones Posada",
  },
  description:
    "Más de 15 años fabricando colchones, bases y almohadas en Armenia, Quindío. Domicilio gratis en Armenia, Calarcá y Génova. Pague con Bold, Addi o Sistecredito.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://www.colchonesposada.lat",
    siteName: "Colchones Posada",
    title: "Colchones Posada | Fábrica de colchones en Armenia, Quindío",
    description:
      "Más de 15 años fabricando colchones, bases y almohadas en Armenia, Quindío. Domicilio gratis en Armenia, Calarcá y Génova. Pague con Bold, Addi o Sistecredito.",
    images: [
      {
        url: "/og/og-image.png",
        width: 1200,
        height: 630,
        alt: "Colchones Posada - Fábrica de colchones en Armenia, Quindío",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Colchones Posada | Fábrica de colchones en Armenia, Quindío",
    description:
      "Más de 15 años fabricando colchones, bases y almohadas en Armenia, Quindío. Domicilio gratis en Armenia, Calarcá y Génova. Pague con Bold, Addi o Sistecredito.",
    images: ["/og/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Colchones Posada",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Carrera 19 #19-50 Local 2 Centro",
                addressLocality: "Armenia",
                addressRegion: "Quindío",
                addressCountry: "CO",
              },
              telephone: "+573112084159",
              openingHours: ["Mo-Fr 09:00-18:00", "Sa 09:00-15:30"],
            }),
          }}
        />
      </head>
      <body className="bg-crema text-texto antialiased">{children}</body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}