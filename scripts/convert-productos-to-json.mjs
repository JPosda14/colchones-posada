import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, "..", "src", "lib", "productos.ts");

let code = readFileSync(src, "utf8");
code = code
  .split("\n")
  .filter((l) => !l.startsWith('import { Producto } from "@/types";'))
  .join("\n");
code = code.replace(
  "export const productos: Producto[] = [",
  "export const productos = ["
);
const fnIndex = code.split("\n").findIndex((l) => l.startsWith("export function "));
if (fnIndex >= 0) {
  code = code.split("\n").slice(0, fnIndex).join("\n");
}

const tmp = path.join(__dirname, "..", ".tmp-productos-json.mjs");
writeFileSync(tmp, code, "utf8");
const mod = await import(pathToFileURL(tmp).href);
rmSync(tmp, { force: true });

const outDir = path.join(__dirname, "seed-data");
mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, "productos.json");
writeFileSync(out, JSON.stringify(mod.productos, null, 2), "utf8");
console.log(`Seed JSON generado: ${out} (${mod.productos.length} productos)`);