import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { cotizacionSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = cotizacionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Faltan campos requeridos o son inválidos" },
        { status: 400 }
      );
    }

    const {
      nombre,
      municipio,
      telefono,
      producto_interes,
      medida_interes,
      comentario,
    } = parsed.data;

    const admin = getSupabaseAdmin();
    const { error } = await admin.from("cotizaciones").insert({
      nombre,
      municipio,
      telefono,
      producto_interes,
      medida_interes: medida_interes || null,
      comentario: comentario || null,
      canal: "web",
      estado: "nueva",
    });

    if (error) {
      return NextResponse.json(
        { error: "No se pudo guardar la cotización" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Cotización recibida para ${producto_interes} en ${municipio}`,
    });
  } catch {
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}