export interface Producto {
  id: string;
  nombre: string;
  slug: string;
  categoria: "colchon" | "base" | "almohada" | "protector";
  descripcion: string | null;
  materiales: string | null;
  firmeza: number | null; // 1-5, solo colchones
  badge: string | null; // 'mas-vendido' | 'premium' | 'oferta' | null
  activo: boolean;
  orden: number;
  created_at: string;
  medidas: ProductoMedida[];
  imagenes: ProductoImagen[];
}

export interface ProductoMedida {
  id: string;
  producto_id: string;
  medida: string;
  dimensiones: string | null;
  precio_normal: number;
  precio_rebajado: number | null;
  disponible: boolean;
}

export interface ProductoImagen {
  id: string;
  producto_id: string;
  url: string;
  tipo: "frontal" | "lateral" | "estructura" | "ambiente";
  orden: number;
  alt: string | null;
}

export interface Cotizacion {
  id: string;
  nombre: string;
  municipio: string;
  telefono: string;
  producto_interes: string | null;
  medida_interes: string | null;
  comentario: string | null;
  estado: "nuevo" | "contactado" | "vendido" | "descartado";
  canal: string;
  valor_venta: number | null;
  created_at: string;
}

export const FIRMEZA_MAP: Record<string, number> = {
  "ortopedico-cassata": 5,
  resortado: 4,
  "super-pillow": 3,
  "resortado-pillow": 2,
};
