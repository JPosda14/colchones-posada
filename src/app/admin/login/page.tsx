import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = {
  title: "Ingreso Admin",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-crema px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 block text-center text-sm text-texto-suave hover:text-verde">
          ← Volver al sitio
        </Link>
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="font-admin text-2xl font-bold text-verde">
            Panel Admin
          </h1>
          <p className="mt-1 text-sm text-texto-suave">
            Ingresa con tu correo autorizado para administrar el catálogo.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}