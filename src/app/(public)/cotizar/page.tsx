"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export default function CotizarPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    municipio: "",
    telefono: "",
    producto_interes: "",
    medida_interes: "",
    comentario: "",
  });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mensaje = `Hola, soy ${formData.nombre}. Vivo en ${formData.municipio}. Me interesa cotizar ${formData.producto_interes}${formData.medida_interes ? ` en medida ${formData.medida_interes}` : ""}. ${formData.comentario ? `Comentario: ${formData.comentario}` : ""}. Mi teléfono es ${formData.telefono}.`;
    window.open(
      `https://wa.me/573112084159?text=${encodeURIComponent(mensaje)}`,
      "_blank"
    );
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="font-heading text-3xl font-bold text-verde">¡Gracias!</p>
        <p className="mt-2 text-texto-suave">
          Su solicitud fue enviada. Pronto nos pondremos en contacto.
        </p>
        <Button
          variant="primary"
          className="mt-6"
          onClick={() => {
            setEnviado(false);
            setFormData({
              nombre: "",
              municipio: "",
              telefono: "",
              producto_interes: "",
              medida_interes: "",
              comentario: "",
            });
          }}
        >
          Enviar otra cotización
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-heading text-3xl font-bold text-texto md:text-4xl">
        Solicitar cotización
      </h1>
      <p className="mt-2 text-texto-suave">
        Déjenos sus datos y le enviaremos una cotización personalizada.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-texto-suave">
              Nombre completo *
            </label>
            <input
              required
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="w-full rounded-lg border border-crema-oscura bg-white px-4 py-2.5 text-texto placeholder:text-texto-suave focus:border-verde focus:outline-none focus:ring-1 focus:ring-verde"
              placeholder="Su nombre"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-texto-suave">
              Municipio *
            </label>
            <input
              required
              value={formData.municipio}
              onChange={(e) =>
                setFormData({ ...formData, municipio: e.target.value })
              }
              className="w-full rounded-lg border border-crema-oscura bg-white px-4 py-2.5 text-texto placeholder:text-texto-suave focus:border-verde focus:outline-none focus:ring-1 focus:ring-verde"
              placeholder="Armenia, Calarcá, ..."
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-texto-suave">
            Teléfono / WhatsApp *
          </label>
          <input
            required
            type="tel"
            value={formData.telefono}
            onChange={(e) =>
              setFormData({ ...formData, telefono: e.target.value })
            }
            className="w-full rounded-lg border border-crema-oscura bg-white px-4 py-2.5 text-texto placeholder:text-texto-suave focus:border-verde focus:outline-none focus:ring-1 focus:ring-verde"
            placeholder="300 000 0000"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-texto-suave">
              Producto de interés *
            </label>
            <select
              required
              value={formData.producto_interes}
              onChange={(e) =>
                setFormData({ ...formData, producto_interes: e.target.value })
              }
              className="w-full rounded-lg border border-crema-oscura bg-white px-4 py-2.5 text-texto focus:border-verde focus:outline-none focus:ring-1 focus:ring-verde"
            >
              <option value="">Seleccione...</option>
              <optgroup label="Colchones">
                <option value="Ortopédico Cassata">Ortopédico Cassata</option>
                <option value="Resortado">Resortado</option>
                <option value="Super Pillow">Super Pillow</option>
                <option value="Resortado Pillow">Resortado Pillow</option>
              </optgroup>
              <optgroup label="Bases">
                <option value="Base de cama">Base de cama</option>
              </optgroup>
              <optgroup label="Almohadas">
                <option value="Almohada Sencilla">Almohada Sencilla</option>
                <option value="Almohada Normal">Almohada Normal</option>
                <option value="Almohada Acolchada">Almohada Acolchada</option>
                <option value="Almohada Memory Foam">Almohada Memory Foam</option>
              </optgroup>
              <optgroup label="Protectores">
                <option value="Protector de colchón">Protector de colchón</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-texto-suave">
              Medida de interés
            </label>
            <select
              value={formData.medida_interes}
              onChange={(e) =>
                setFormData({ ...formData, medida_interes: e.target.value })
              }
              className="w-full rounded-lg border border-crema-oscura bg-white px-4 py-2.5 text-texto focus:border-verde focus:outline-none focus:ring-1 focus:ring-verde"
            >
              <option value="">Seleccione...</option>
              <option value="Individual">Individual</option>
              <option value="Sencillo">Sencillo</option>
              <option value="Doble">Doble</option>
              <option value="Queen">Queen</option>
              <option value="King">King</option>
              <option value="Única">Única</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-texto-suave">
            Comentario adicional
          </label>
          <textarea
            value={formData.comentario}
            onChange={(e) =>
              setFormData({ ...formData, comentario: e.target.value })
            }
            rows={3}
            className="w-full rounded-lg border border-crema-oscura bg-white px-4 py-2.5 text-texto placeholder:text-texto-suave focus:border-verde focus:outline-none focus:ring-1 focus:ring-verde"
            placeholder="¿Alguna pregunta o requerimiento especial?"
          />
        </div>

        <Button type="submit" variant="primary" size="lg">
          Enviar solicitud 📨
        </Button>
      </form>
    </div>
  );
}
