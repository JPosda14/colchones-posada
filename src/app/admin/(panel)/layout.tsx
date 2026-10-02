import Link from "next/link";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { createClient } from "@/utils/supabase/server";
import { isEmailAdmin } from "@/lib/admin-auth";
import { signOut } from "../actions";

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");
  if (!isEmailAdmin(user.email)) redirect("/admin/login?error=no-autorizado");

  return (
    <div className="min-h-screen bg-crema font-admin">
      <nav className="border-b border-crema-oscura bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/admin"
            className="text-lg font-bold text-verde"
          >
            Panel Admin
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/admin/productos"
              className="text-sm text-texto-suave hover:text-verde"
            >
              Productos
            </Link>
            <Link
              href="/admin/cotizaciones"
              className="text-sm text-texto-suave hover:text-verde"
            >
              Cotizaciones
            </Link>
            <Link href="/" className="text-sm text-texto-suave hover:text-verde">
              ← Volver al sitio
            </Link>
            <span className="hidden text-sm text-texto-suave md:inline">
              {user.email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-lg border border-crema-oscura bg-white px-3 py-1.5 text-sm text-texto-suave transition hover:border-red-200 hover:text-red-600"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </nav>
      <div className="mx-auto max-w-7xl px-4 py-8">{children}</div>
      <Toaster
        position="top-right"
        toastOptions={{ style: { fontFamily: "DM Sans, sans-serif" } }}
      />
    </div>
  );
}