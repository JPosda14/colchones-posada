import { NextResponse } from "next/server";
import { productos } from "@/lib/productos";

export async function GET() {
  return NextResponse.json({ data: productos });
}
