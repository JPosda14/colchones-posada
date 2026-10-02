import type { MetadataRoute } from "next";
import { getProductosPublicos } from "@/lib/productos";

const BASE_URL = "https://www.colchonesposada.lat";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productos = await getProductosPublicos();

  const rutasProductos: MetadataRoute.Sitemap = productos.map((p) => ({
    url: `${BASE_URL}/producto/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/cotizar`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...rutasProductos,
  ];
}