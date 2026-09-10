import { z } from "zod";

export const cotizacionSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  municipio: z.string().min(1, "El municipio es obligatorio"),
  telefono: z
    .string()
    .regex(/^\d{7,15}$/, "Ingrese un teléfono válido (7 a 15 dígitos)."),
  peso: z.string().optional(),
  preferencia_dureza: z.string().optional(),
  producto_interes: z.string().min(1, "Seleccione un producto"),
  medida_interes: z.string().optional(),
  comentario: z.string().optional(),
});

export type CotizacionFormData = z.infer<typeof cotizacionSchema>;