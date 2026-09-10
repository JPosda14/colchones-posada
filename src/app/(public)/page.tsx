import Image from "next/image";
import { Catalogo } from "@/components/catalogo";
import { ZonasSection } from "@/components/public/ZonasSection";
import { CotizacionForm } from "@/components/cotizacion/CotizacionForm";
import { productos } from "@/lib/productos";

export default function Home() {
  return (
    <>
      {/* #inicio - Hero */}
      <section id="inicio" className="relative min-h-screen w-full overflow-hidden">
        <Image
          src="/images/hero/MenuFoto.jpeg"
          alt="Habitación con cama y colchón Colchones Posada"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.35) 50%, rgba(0, 0, 0, 0.10) 100%)",
          }}
        />

        <div className="absolute bottom-24 left-8 md:bottom-24 md:left-16">
          <p className="mb-3 text-xs font-light uppercase tracking-widest text-white/70">
            Colchones Posada
          </p>
          <h1
            className="mb-8 text-4xl font-normal italic leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Más de 15 años
            <br />
            fabricando
            <br />
            su descanso
          </h1>
          <a
            href="#catalogo"
            className="inline-flex rounded-none border border-white px-8 py-3 text-sm uppercase tracking-widest text-white transition-colors duration-300 hover:bg-white hover:text-black"
          >
            Ver catálogo →
          </a>
        </div>

        <div className="absolute bottom-0 left-0 right-0 grid grid-cols-3 bg-black/40 px-6 py-4 backdrop-blur-sm md:px-16">
          <div className="border-r border-white/20 pr-3 md:pr-8">
            <p className="mb-1 text-[10px] uppercase tracking-widest text-white/50">
              Fabricación
            </p>
            <p className="text-xs font-light text-white/90 sm:text-sm">
              Hecha con nuestras propias manos
            </p>
          </div>
          <div className="border-r border-white/20 px-3 md:px-8">
            <p className="mb-1 text-[10px] uppercase tracking-widest text-white/50">
              Garantía
            </p>
            <p className="text-xs font-light text-white/90 sm:text-sm">
              5 años en todos los colchones
            </p>
          </div>
          <div className="pl-3 md:pl-8">
            <p className="mb-1 text-[10px] uppercase tracking-widest text-white/50">
              Entrega
            </p>
            <p className="text-xs font-light text-white/90 sm:text-sm">
              Domicilio gratis en Armenia y Calarcá
            </p>
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

          <Catalogo productos={productos} />
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

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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

          <ZonasSection />
        </div>
      </section>

      {/* #nosotros */}
      <section id="nosotros" className="scroll-mt-20 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-verde-muy-claro">
              <Image
                src="/images/colchones/ResortadoExtFront.png"
                alt="Taller de fabricación de colchones - Colchones Posada Armenia Quindío"
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