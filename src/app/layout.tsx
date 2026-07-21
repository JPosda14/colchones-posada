import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Colchones Posada | Fábrica de colchones en Armenia, Quindío",
  description:
    "Más de 15 años fabricando colchones, bases y almohadas. Domicilio gratis en Armenia, Calarcá y Génova. Pague con Bold, Addi o Sistecredito.",
  icons: {
    icon: {
      url: "/logo/Logo_Colchones.png",
      type: "image/png",
    },
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
    </html>
  );
}
