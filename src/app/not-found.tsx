import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "El contenido que buscas no está disponible o fue movido.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main
        id="main-content"
        className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center"
      >
        <p
          className="text-9xl font-normal leading-none text-verde"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          404
        </p>
        <h1 className="mt-6 text-3xl font-bold text-texto md:text-4xl">
          Esta página no existe
        </h1>
        <p className="mt-3 max-w-md text-texto-suave">
          El contenido que buscas no está disponible o fue movido.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg bg-verde px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-verde/90"
        >
          Volver al inicio →
        </Link>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}