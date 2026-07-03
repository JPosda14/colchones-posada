import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, municipio, telefono, producto_interes } = body;

    if (!nombre || !municipio || !telefono || !producto_interes) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // TODO: Insertar en Supabase cuando esté configurado
    // const { data, error } = await supabase.from("cotizaciones").insert({...});

    return NextResponse.json({
      success: true,
      message: "Cotización recibida",
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
