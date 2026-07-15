"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui";

const NAV_LINKS = [
  { href: "#catalogo", label: "Catálogo" },
  { href: "#como", label: "¿Cómo funciona?" },
  { href: "#zonas", label: "Entregas" },
  { href: "#nosotros", label: "Nosotros" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-verde-oscuro/95 shadow-lg backdrop-blur-sm"
          : "bg-verde shadow-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <Image
            src="/logo/Logo_Colchones.png"
            alt="Colchones Posada"
            width={151}
            height={70}
            className="h-10 w-auto md:h-12"
            priority
          />
          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold leading-tight text-white md:text-xl">
              Colchones Posada
            </span>
            <span className="text-[11px] text-verde-claro/80 md:text-xs">
              Fábrica propia · Armenia, Quindío
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-verde-muy-claro/80 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <Button
            variant="whatsapp"
            size="sm"
            onClick={() => window.open("https://wa.me/573112084159", "_blank")}
          >
            Cotizar
          </Button>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-50 flex h-11 w-11 items-center justify-center text-white md:hidden"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          isOpen ? "max-h-80" : "max-h-0"
        }`}
      >
        <div className="border-t border-verde-claro/20 bg-verde-oscuro/90 px-4 pb-5 pt-3 backdrop-blur-sm">
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-verde-muy-claro/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 px-4 pt-2">
              <Button
                variant="whatsapp"
                size="md"
                className="w-full"
                onClick={() =>
                  window.open("https://wa.me/573112084159", "_blank")
                }
              >
                Cotizar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
