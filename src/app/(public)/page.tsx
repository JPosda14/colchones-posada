"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui";
import { ProductoCard, FiltroBar } from "@/components/catalogo";
import { productos } from "@/lib/productos";

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
      <section id="inicio" className="bg-verde py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="text-white">
              <p className="mb-2 text-sm font-medium text-verde-muy-claro">
                Fábrica propia · Armenia, Quindío
              </p>
              <h1 className="font-heading text-4xl font-bold leading-tight md:text-5xl">
                Más de 15 años fabricando su descanso
              </h1>
              <p className="mt-4 text-lg text-verde-muy-claro">
                Colchones, bases, almohadas y protectores. Fabricación propia
                con los mejores materiales del mercado.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  variant="whatsapp"
                  size="lg"
                  onClick={() =>
                    window.open("https://wa.me/573112084159", "_blank")
                  }
                >
                  💬 Cotizar ahora
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    document
                      .getElementById("catalogo")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="border-white text-white hover:bg-white hover:text-verde"
                >
                  Ver catálogo
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 text-sm text-verde-muy-claro">
                <span>✅ Domicilio gratis</span>
                <span>✅ 5 años de garantía</span>
                <span>✅ Medidas especiales</span>
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
      <section id="como" className="scroll-mt-20 bg-crema-oscura py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-3xl font-bold text-texto md:text-4xl">
            ¿Cómo funciona?
          </h2>
          <p className="mt-2 text-texto-suave">
            Adquirir tu colchón nunca fue tan fácil.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-4">
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
              <div key={paso.num} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-verde text-2xl font-bold text-white">
                  {paso.num}
                </div>
                <h3 className="mt-4 font-heading text-xl font-semibold text-texto">
                  {paso.title}
                </h3>
                <p className="mt-2 text-sm text-texto-suave">{paso.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* #zonas - Zonas de entrega */}
      <section
        id="zonas"
        className="scroll-mt-20 bg-verde py-16 text-white md:py-24"
      >
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            Zonas de entrega
          </h2>
          <p className="mt-2 text-verde-muy-claro">
            Domicilio sin costo en las siguientes zonas.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm"
              >
                <h3 className="font-heading text-xl font-semibold">
                  {zona.municipio}
                </h3>
                <p className="mt-2 text-sm text-verde-muy-claro">
                  {zona.entrega}
                </p>
                {zona.badge && (
                  <span className="mt-3 inline-block rounded-full bg-verde-claro px-3 py-1 text-xs font-medium text-white">
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
                    className="mt-3"
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
      <section id="nosotros" className="scroll-mt-20 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-crema-oscura">
              <Image
                src="/images/taller/ResortadoPillowInt.jpeg"
                alt="Taller de fabricación Colchones Posada"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute bottom-4 left-4 flex gap-3">
                <div className="rounded-xl bg-white/90 px-4 py-2 text-center backdrop-blur-sm">
                  <p className="font-heading text-xl font-bold text-verde">
                    +15
                  </p>
                  <p className="text-xs text-texto-suave">Años</p>
                </div>
                <div className="rounded-xl bg-white/90 px-4 py-2 text-center backdrop-blur-sm">
                  <p className="font-heading text-xl font-bold text-verde">
                    Propia
                  </p>
                  <p className="text-xs text-texto-suave">Fabricación</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-heading text-3xl font-bold text-texto md:text-4xl">
                Nuestra historia
              </h2>
              <p className="mt-4 text-texto-suave">
                Colchones Posada nació hace más de 15 años en Armenia, Quindío,
                como un negocio familiar comprometido con la calidad y el
                descanso de nuestros clientes.
              </p>
              <p className="mt-3 text-texto-suave">
                Fabricamos cada colchón con nuestros propias manos, usando los
                mejores materiales del mercado y adaptándonos constantemente a
                las nuevas tecnologías del descanso.
              </p>
              <blockquote className="mt-6 border-l-4 border-verde pl-4 font-heading text-lg italic text-verde">
                &ldquo;Usamos los mejores materiales, tenemos experiencia de 15
                años, y si salen mejores materiales los conseguimos.&rdquo;
              </blockquote>

              <div className="mt-8 flex flex-wrap gap-4">
                {["Fabricación propia", "Sin intermediarios", "Atención personalizada"].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-full bg-verde-muy-claro px-4 py-2 text-sm font-medium text-verde"
                    >
                      ✅ {item}
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
        className="scroll-mt-20 bg-crema-oscura py-16 md:py-24"
      >
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-heading text-3xl font-bold text-texto md:text-4xl">
            Solicitar cotización
          </h2>
          <p className="mt-2 text-texto-suave">
            Déjenos sus datos y le enviaremos una cotización personalizada.
          </p>

          <CotizacionForm />
        </div>
      </section>
    </>
  );
}

function CotizacionForm() {
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
  );
}
