"use client";

import { useState } from "react";
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

  return (
    <nav className="sticky top-0 z-50 bg-verde shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo/Logo_Colchones.png"
            alt="Colchones Posada"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <div className="hidden flex-col sm:flex">
            <span className="font-heading text-lg font-semibold leading-tight text-white">
              Colchones Posada
            </span>
            <span className="text-xs text-verde-muy-claro">
              Fábrica propia · Quindío
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-verde-muy-claro transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <Button
            variant="whatsapp"
            size="sm"
            onClick={() => window.open("https://wa.me/573112084159", "_blank")}
          >
            💬 Cotizar
          </Button>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white md:hidden"
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

      {isOpen && (
        <div className="border-t border-verde-claro/30 bg-verde px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-3 pt-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm text-verde-muy-claro transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <Button
              variant="whatsapp"
              size="sm"
              onClick={() =>
                window.open("https://wa.me/573112084159", "_blank")
              }
            >
              💬 Cotizar
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
