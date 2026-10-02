import { ProductoForm } from "@/components/admin/ProductoForm";

export const metadata = {
  title: "Nuevo producto",
  robots: { index: false, follow: false },
};

export default function NuevoProductoPage() {
  return (
    <div>
      <h1 className="font-admin text-2xl font-bold text-texto">
        Nuevo producto
      </h1>
      <p className="mt-1 text-sm text-texto-suave">
        Completa la información y presiona guardar para publicarlo en el
        catálogo.
      </p>
      <div className="mt-6">
        <ProductoForm producto={null} />
      </div>
    </div>
  );
}