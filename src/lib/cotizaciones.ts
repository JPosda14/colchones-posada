export const ESTADOS_COTIZACION = ["nueva", "contactado", "cerrada"] as const;

export type EstadoCotizacion = (typeof ESTADOS_COTIZACION)[number];

export const ESTADOS_LABEL: Record<EstadoCotizacion, string> = {
  nueva: "Nueva",
  contactado: "Contactado",
  cerrada: "Cerrada",
};

export interface CotizacionFila {
  id: string;
  nombre: string;
  municipio: string;
  telefono: string;
  producto_interes: string;
  medida_interes: string | null;
  comentario: string | null;
  canal: string | null;
  estado: EstadoCotizacion;
  createdAt: string;
}