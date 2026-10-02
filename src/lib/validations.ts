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

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "El correo es obligatorio")
    .email("Ingrese un correo válido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const productoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(100, "Máximo 100 caracteres"),
  slug: z
    .string()
    .trim()
    .min(1, "El slug es obligatorio")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug inválido (solo minúsculas, números y guiones)"
    ),
  categoria: z.enum(["colchon", "base", "almohada", "protector"]),
  descripcion: z.string().trim().max(2000).optional().or(z.literal("")),
  materiales: z.string().trim().max(500).optional().or(z.literal("")),
  firmeza: z.number().min(1).max(5).nullable().optional(),
  badge: z.enum(["mas-vendido", "premium", "oferta"]).optional().or(z.literal("")),
  activo: z.boolean(),
  orden: z.number().int().min(0).max(999),
  garantia: z.string().trim().max(200).optional().or(z.literal("")),
  medidas: z
    .array(
      z.object({
        medida: z.string().trim().min(1, "La medida es obligatoria"),
        dimensiones: z.string().trim().optional().or(z.literal("")),
        precio_normal: z.number().min(1, "El precio normal debe ser mayor a 0"),
        precio_rebajado: z.number().min(0).nullable().optional(),
        disponible: z.boolean(),
      })
    )
    .min(1, "Agrega al menos una medida"),
  imagenes: z
    .array(
      z.object({
        url: z.string().min(1, "URL de imagen vacía"),
        tipo: z.enum(["frontal", "lateral", "estructura", "ambiente"]),
        orden: z.number().int().min(0),
        alt: z.string().trim().optional().or(z.literal("")),
      })
    )
    .min(1, "Agrega al menos una imagen"),
});

export type ProductoFormData = z.infer<typeof productoSchema>;
export type MedidaFormData = ProductoFormData["medidas"][number];
export type ImagenFormData = ProductoFormData["imagenes"][number];

export const CATEGORIAS = ["colchon", "base", "almohada", "protector"] as const;
export const BADGES = ["mas-vendido", "premium", "oferta"] as const;
export const TIPOS_IMAGEN = ["frontal", "lateral", "estructura", "ambiente"] as const;