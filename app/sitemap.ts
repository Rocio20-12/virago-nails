import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/servicios", "/galeria", "/nosotros", "/contacto", "/reservar"].map((p) => ({ url: `https://viragonails.com.ar${p}`, lastModified: new Date() }));
}
