import { generarLinkWAGenerico } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="bg-verde text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-heading text-xl font-semibold">Colchones Posada</h3>
            <p className="mt-2 text-sm text-verde-muy-claro">
              Más de 15 años fabricando su descanso.
            </p>
            <p className="mt-4 text-sm">
              Carrera 19 #19-50 Local 2 Centro
              <br />
              Armenia, Quindío, Colombia
            </p>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold">Horarios</h4>
            <ul className="mt-2 space-y-1 text-sm text-verde-muy-claro">
              <li>Lun – Vie: 9am – 6pm</li>
              <li>Sáb: 9am – 3:30pm</li>
              <li>Dom y Festivos: Cerrado</li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold">Contacto</h4>
            <ul className="mt-2 space-y-1 text-sm text-verde-muy-claro">
              <li><a href="tel:+573112084159" className="transition-colors hover:text-white">📱 311 208 4159</a></li>
              <li><a href="tel:+573112288444" className="transition-colors hover:text-white">📱 311 228 8444</a></li>
            </ul>
            <a
              href={generarLinkWAGenerico()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-whatsapp px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-whatsapp/90"
            >
              💬 Escríbenos por WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-verde-claro/30 pt-6 text-center text-sm text-verde-muy-claro">
          <p>© {new Date().getFullYear()} Colchones Posada. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
