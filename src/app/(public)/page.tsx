"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui";
import { ProductoCard, FiltroBar } from "@/components/catalogo";
import { productos } from "@/lib/productos";
import type { ProductoMedida } from "@/types";

export default function Home() {
  const [filtro, setFiltro] = useState("todos");

  const productosFiltrados =
    filtro === "todos"
      ? productos.filter((p) => p.activo)
      : productos.filter((p) => p.categoria === filtro && p.activo);

  const superPillow = productos.find((p) => p.slug === "super-pillow")!;

  return (
    <>
      {/* #inicio - Hero */}
      <section id="inicio" className="relative overflow-hidden bg-gradient-to-br from-verde-oscuro via-verde to-verde py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
        <div className="absolute left-0 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_bottom_left,rgba(82,183,136,0.2)_0%,transparent_50%)]" />
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="text-white">
              <p className="mb-3 text-sm font-medium tracking-wider text-verde-claro/80 uppercase">
                Fábrica propia · Armenia, Quindío
              </p>
              <h1 className="font-heading text-display-md font-extrabold text-white">
                Más de 15 años fabricando su descanso
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/90">
                Colchones, bases, almohadas y protectores. Fabricación propia
                con los mejores materiales del mercado.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button
                  variant="whatsapp"
                  size="lg"
                  onClick={() =>
                    window.open("https://wa.me/573112084159", "_blank")
                  }
                >
                  Cotizar ahora
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    document
                      .getElementById("catalogo")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="border-white/70 text-white/90 hover:border-white hover:bg-white hover:text-verde"
                >
                  Ver catálogo
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-verde-muy-claro/80">
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-verde-claro/20 text-xs">✓</span>
                  Domicilio gratis
                </span>
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-verde-claro/20 text-xs">✓</span>
                  5 años de garantía
                </span>
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-verde-claro/20 text-xs">✓</span>
                  Medidas especiales
                </span>
              </div>
            </div>
            <div className="relative aspect-square md:aspect-[4/3]">
              {superPillow && superPillow.imagenes[0] && (
                <Image
                  src={superPillow.imagenes[0].url}
                  alt="Colchón Super Pillow - Producto estrella"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* #catalogo */}
      <section id="catalogo" className="scroll-mt-20 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-3xl font-bold text-texto md:text-4xl">
            Nuestros productos
          </h2>
          <p className="mt-2 text-texto-suave">
            Fabricamos cada producto con materiales de la más alta calidad.
          </p>

          <div className="mt-8">
            <FiltroBar activo={filtro} onChange={setFiltro} />
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productosFiltrados.map((p) => (
              <ProductoCard key={p.id} producto={p} />
            ))}
          </div>

          {productosFiltrados.length === 0 && (
            <p className="py-12 text-center text-texto-suave">
              No hay productos en esta categoría.
            </p>
          )}
        </div>
      </section>

      {/* #como - Cómo funciona */}
      <section id="como" className="scroll-mt-20 bg-gradient-to-b from-verde-oscuro to-verde py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="font-heading text-display-sm font-bold text-white">
              ¿Cómo funciona?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-verde-muy-claro/80">
              Adquirir tu colchón nunca fue tan fácil.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {[
              {
                num: "1",
                title: "Elige",
                desc: "Explora nuestro catálogo y encuentra el producto ideal para ti.",
              },
              {
                num: "2",
                title: "Cotiza",
                desc: "Solicita tu cotización por WhatsApp o desde el formulario.",
              },
              {
                num: "3",
                title: "Recibe",
                desc: "Te llevamos el pedido a tu casa el mismo día sin costo adicional.",
              },
              {
                num: "4",
                title: "Descansa",
                desc: "Disfruta de tu nuevo colchón con 5 años de garantía.",
              },
            ].map((paso) => (
              <div key={paso.num} className="group text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-3xl font-bold text-white ring-1 ring-white/20 backdrop-blur-sm transition-all group-hover:bg-white group-hover:text-verde group-hover:ring-white/40">
                  {paso.num}
                </div>
                <h3 className="mt-6 font-heading text-xl font-bold text-white">
                  {paso.title}
                </h3>
                <p className="mt-3 leading-relaxed text-verde-muy-claro/75">
                  {paso.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* #zonas - Zonas de entrega */}
      <section
        id="zonas"
        className="scroll-mt-20 bg-gradient-to-t from-verde-oscuro to-verde py-20 text-white md:py-28"
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="font-heading text-display-sm font-bold text-white">
              Zonas de entrega
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-verde-muy-claro/80">
              Domicilio sin costo en las siguientes zonas.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                municipio: "Armenia",
                entrega: "Entrega el mismo día",
                badge: "Domicilio gratis",
              },
              {
                municipio: "Calarcá",
                entrega: "Entrega el mismo día",
                badge: "Domicilio gratis",
              },
              {
                municipio: "Génova",
                entrega: "Consultar disponibilidad",
                badge: "Domicilio gratis",
              },
              {
                municipio: "Otros municipios",
                entrega: "Consultar",
                badge: null,
              },
            ].map((zona) => (
              <div
                key={zona.municipio}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-lg">
                  📍
                </div>
                <h3 className="mt-4 font-heading text-xl font-bold text-white">
                  {zona.municipio}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-verde-muy-claro/75">
                  {zona.entrega}
                </p>
                {zona.badge && (
                  <span className="mt-4 inline-block rounded-full bg-verde-claro/20 px-3 py-1 text-xs font-semibold tracking-wide text-verde-claro uppercase">
                    {zona.badge}
                  </span>
                )}
                {zona.municipio === "Otros municipios" && (
                  <Button
                    variant="whatsapp"
                    size="sm"
                    onClick={() =>
                      window.open("https://wa.me/573112084159", "_blank")
                    }
                    className="mt-4"
                  >
                    Consultar
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* #nosotros */}
      <section id="nosotros" className="scroll-mt-20 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-verde-muy-claro">
              <Image
                src="/images/colchones/ResortadoExtFront.png"
                alt="Colchón Colchones Posada"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute bottom-4 left-4 flex gap-3">
                <div className="rounded-xl bg-white/90 px-5 py-3 text-center shadow-lg backdrop-blur-sm">
                  <p className="font-heading text-2xl font-extrabold text-verde">
                    +15
                  </p>
                  <p className="text-xs font-medium text-texto-suave">Años</p>
                </div>
                <div className="rounded-xl bg-white/90 px-5 py-3 text-center shadow-lg backdrop-blur-sm">
                  <p className="font-heading text-2xl font-extrabold text-verde">
                    Propia
                  </p>
                  <p className="text-xs font-medium text-texto-suave">Fabricación</p>
                </div>
              </div>
            </div>

            <div>
              <span className="mb-4 inline-block text-sm font-medium tracking-wider text-verde-claro uppercase">
                Nuestra historia
              </span>
              <h2 className="font-heading text-display-sm font-bold text-texto">
                Hecho en Armenia, con las manos y el corazón
              </h2>
              <div className="mt-6 space-y-4 leading-relaxed text-texto-suave">
                <p>
                  Colchones Posada nació hace más de 15 años en Armenia, Quindío,
                  como un negocio familiar comprometido con la calidad y el
                  descanso de nuestros clientes.
                </p>
                <p>
                  Fabricamos cada colchón con nuestros propias manos, usando los
                  mejores materiales del mercado y adaptándonos constantemente a
                  las nuevas tecnologías del descanso.
                </p>
              </div>
              <blockquote className="relative mt-8 rounded-xl bg-verde-muy-claro/50 p-6 font-heading text-lg italic leading-relaxed text-verde">
                <span className="absolute -top-0.5 left-4 text-6xl leading-none text-verde/20">&ldquo;</span>
                Usamos los mejores materiales, tenemos experiencia de 15
                años, y si salen mejores materiales los conseguimos.
              </blockquote>

              <div className="mt-10 flex flex-wrap gap-3">
                {["Fabricación propia", "Sin intermediarios", "Atención personalizada"].map(
                  (item) => (
                    <span
                      key={item}
                      className="flex items-center gap-1.5 rounded-full bg-verde-muy-claro px-4 py-2 text-sm font-medium text-verde"
                    >
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-verde/20 text-[10px]">✓</span>
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* #cotizar - Formulario */}
      <section
        id="cotizar"
        className="scroll-mt-20 bg-crema-oscura py-20 md:py-28"
      >
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center">
            <h2 className="font-heading text-display-sm font-bold text-texto">
              Solicitar cotización
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-texto-suave">
              Déjenos sus datos y le enviaremos una cotización personalizada.
            </p>
          </div>

          <CotizacionForm />
        </div>
      </section>
    </>
  );
}

const PRODUCTOS_SIN_MEDIDA = [
  "Almohada Sencilla",
  "Almohada Normal",
  "Almohada Acolchada",
  "Almohada Memory Foam",
];

function CotizacionForm() {
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
      <div className="mt-8 rounded-2xl bg-white p-8 text-center">
        <p className="font-heading text-2xl font-bold text-verde">¡Gracias!</p>
        <p className="mt-2 text-texto-suave">
          Su solicitud fue enviada. Pronto nos pondremos en contacto.
        </p>
        <Button
          variant="primary"
          className="mt-4"
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
            className="w-full rounded-lg border border-crema-oscura bg-white px-4 py-2.5 text-texto placeholder:text-texto-suave focus:border-verde focus:outline-none focus:ring-1 focus:ring-verde min-h-[44px]"
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
            className="w-full rounded-lg border border-crema-oscura bg-white px-4 py-2.5 text-texto placeholder:text-texto-suave focus:border-verde focus:outline-none focus:ring-1 focus:ring-verde min-h-[44px]"
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
          className="w-full rounded-lg border border-crema-oscura bg-white px-4 py-2.5 text-texto placeholder:text-texto-suave focus:border-verde focus:outline-none focus:ring-1 focus:ring-verde min-h-[44px]"
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
            className="w-full rounded-lg border border-crema-oscura bg-white px-4 py-2.5 text-texto placeholder:text-texto-suave focus:border-verde focus:outline-none focus:ring-1 focus:ring-verde min-h-[44px]"
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
            className="w-full rounded-lg border border-crema-oscura bg-white px-4 py-2.5 text-texto focus:border-verde focus:outline-none focus:ring-1 focus:ring-verde min-h-[44px]"
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
            className="w-full rounded-lg border border-crema-oscura bg-white px-4 py-2.5 text-texto focus:border-verde focus:outline-none focus:ring-1 focus:ring-verde min-h-[44px]"
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
              className="w-full rounded-lg border border-crema-oscura bg-white px-4 py-2.5 text-texto focus:border-verde focus:outline-none focus:ring-1 focus:ring-verde min-h-[44px]"
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
          className="w-full rounded-lg border border-crema-oscura bg-white px-4 py-2.5 text-texto placeholder:text-texto-suave focus:border-verde focus:outline-none focus:ring-1 focus:ring-verde min-h-[44px]"
          placeholder="¿Alguna pregunta o requerimiento especial?"
        />
      </div>

      <Button type="submit" variant="primary" size="lg">
        Enviar solicitud 📨
      </Button>
    </form>
  );
}
