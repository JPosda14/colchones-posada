const NUMERO = "573112084159";

export function generarLinkWA(producto: string, medida: string): string {
  const mensaje = encodeURIComponent(
    `Hola, me interesa el ${producto} en medida ${medida}. ¿Me puede dar más información y el precio?`
  );
  return `https://wa.me/${NUMERO}?text=${mensaje}`;
}

export function generarLinkWAGenerico(): string {
  const mensaje = encodeURIComponent(
    "Hola, me gustaría recibir más información sobre sus productos."
  );
  return `https://wa.me/${NUMERO}?text=${mensaje}`;
}

export function generarLinkWACotizacion(data: {
  nombre: string;
  producto: string;
  medida: string;
}): string {
  const mensaje = encodeURIComponent(
    `Hola, soy ${data.nombre}. Me interesa cotizar ${data.producto}${data.medida ? ` en medida ${data.medida}` : ""}.`
  );
  return `https://wa.me/${NUMERO}?text=${mensaje}`;
}
