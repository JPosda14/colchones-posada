import type { Metadata } from "next";
import { CotizacionForm } from "@/components/cotizacion/CotizacionForm";

export const metadata: Metadata = {
  title: "Solicitar cotización",
  description:
    "Solicita una cotización personalizada de colchones, bases, almohadas y protectores en Colchones Posada, Armenia Quindío.",
};

export default function CotizarPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-heading text-3xl font-bold text-texto md:text-4xl">
        Solicitar cotización
      </h1>
      <p className="mt-2 text-texto-suave">
        Déjenos sus datos y le enviaremos una cotización personalizada.
      </p>

      <CotizacionForm />
    </div>
  );
}