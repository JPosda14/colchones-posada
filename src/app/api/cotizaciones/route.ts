import { NextResponse } from "next/server";
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

    const { nombre, municipio, telefono, producto_interes } = parsed.data;

    // TODO: Insertar en Supabase cuando esté configurado
    // const { data, error } = await supabase.from("cotizaciones").insert({...});

    return NextResponse.json({
      success: true,
      message: `Cotización recibida para ${producto_interes} en ${municipio}`,
      quien: { nombre, telefono },
    });
  } catch {
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // TODO: Obtener de Supabase cuando esté configurado
  return NextResponse.json({ data: [] });
}