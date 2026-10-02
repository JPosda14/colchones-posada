import { NextResponse } from "next/server";
import { getProductosPublicos } from "@/lib/productos";

export async function GET() {
  try {
    const data = await getProductosPublicos();
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "No se pudo cargar el catálogo" },
      { status: 500 }
    );
  }
}