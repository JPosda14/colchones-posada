"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { productos } from "@/lib/productos";
import type { ProductoMedida } from "@/types";

const PRODUCTOS_SIN_MEDIDA = [
  "Almohada Sencilla",
  "Almohada Normal",
  "Almohada Acolchada",
  "Almohada Memory Foam",
];

export default function CotizarPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    municipio: "",
    telefono: "",
    peso: "",
    preferencia_dureza: "",
    producto_interes: "",
    medida_interes: "",
    comentario: "",
  });
  const [enviado, setEnviado] = useState(false);

  const productoActual = productos.find((p) => p.nombre === formData.producto_interes);
  const medidasDisponibles: ProductoMedida[] = productoActual
    ? productoActual.medidas.filter((m) => m.disponible)
    : [];

  const mostrarMedida = formData.producto_interes && !PRODUCTOS_SIN_MEDIDA.includes(formData.producto_interes);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let mensaje = `Hola, soy ${formData.nombre}. Vivo en ${formData.municipio}. Me interesa cotizar ${formData.producto_interes}`;
    if (formData.medida_interes) mensaje += ` en medida ${formData.medida_interes}`;
    if (formData.peso) mensaje += `. Peso: ${formData.peso} kg`;
    if (formData.preferencia_dureza) mensaje += `. Preferencia: ${formData.preferencia_dureza}`;
    if (formData.comentario) mensaje += `. Comentario: ${formData.comentario}`;
    mensaje += `. Mi teléfono es ${formData.telefono}.`;
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
              peso: "",
              preferencia_dureza: "",
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
              Peso de la persona que va a usar el colchón
            </label>
            <input
              type="number"
              value={formData.peso}
              onChange={(e) =>
                setFormData({ ...formData, peso: e.target.value })
              }
              className="w-full rounded-lg border border-crema-oscura bg-white px-4 py-2.5 text-texto placeholder:text-texto-suave focus:border-verde focus:outline-none focus:ring-1 focus:ring-verde"
              placeholder="Ej: 70 kg"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-texto-suave">
              Preferencia de dureza del colchón
            </label>
            <select
              value={formData.preferencia_dureza}
              onChange={(e) =>
                setFormData({ ...formData, preferencia_dureza: e.target.value })
              }
              className="w-full rounded-lg border border-crema-oscura bg-white px-4 py-2.5 text-texto focus:border-verde focus:outline-none focus:ring-1 focus:ring-verde"
            >
              <option value="">Seleccione...</option>
              <option value="Blanda">Blanda</option>
              <option value="Media">Media</option>
              <option value="Firme">Firme</option>
              <option value="Muy firme">Muy firme</option>
            </select>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-texto-suave">
              Producto de interés *
            </label>
            <select
              required
              value={formData.producto_interes}
              onChange={(e) => {
                setFormData({ ...formData, producto_interes: e.target.value, medida_interes: "" });
              }}
              className="w-full rounded-lg border border-crema-oscura bg-white px-4 py-2.5 text-texto focus:border-verde focus:outline-none focus:ring-1 focus:ring-verde"
            >
              <option value="">Seleccione...</option>
              <optgroup label="Colchones">
                <option value="Ortopédico Cassata">Ortopédico Cassata</option>
                <option value="Resortado">Resortado</option>
                <option value="Super Pillow">Super Pillow</option>
                <option value="Resortado Pillow">Resortado Pillow</option>
                <option value="Resortado Penta">Resortado Penta</option>
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

          {mostrarMedida && (
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
                {medidasDisponibles.map((m) => (
                  <option key={m.id} value={m.medida}>
                    {m.medida}
                  </option>
                ))}
              </select>
            </div>
          )}
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
