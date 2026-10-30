import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export const ROM_BUCKET = "private-roms";
export const MAX_ROM_SIZE_BYTES = 512 * 1024 * 1024;

const ALLOWED_ROM_EXTENSIONS = new Set([
  "nes", "sfc", "smc", "n64", "z64", "v64", "gb", "gbc", "gba",
  "md", "gen", "cue", "iso", "bin", "chd", "pbp"
]);

function getExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

export function validateRomFile(file: File): string | null {
  if (!ALLOWED_ROM_EXTENSIONS.has(getExtension(file.name))) {
    return "Formato de arquivo não reconhecido como ROM compatível.";
  }
  if (file.size <= 0) return "O arquivo está vazio.";
  if (file.size > MAX_ROM_SIZE_BYTES) {
    return "O arquivo excede o limite atual de 512 MiB.";
  }
  return null;
}

export async function uploadPrivateRom(user: User, file: File) {
  if (!supabase) throw new Error("O Supabase ainda não foi configurado neste ambiente.");

  const validationError = validateRomFile(file);
  if (validationError) throw new Error(validationError);

  // Prefixo com o ID autenticado: a política de Storage valida essa pasta no servidor.
  const safeName = file.name.normalize("NFKC").replace(/[^a-zA-Z0-9._-]/g, "_");
  const objectPath = `${user.id}/${crypto.randomUUID()}-${safeName}`;

  const { data, error } = await supabase.storage
    .from(ROM_BUCKET)
    .upload(objectPath, file, {
      cacheControl: "0",
      contentType: "application/octet-stream",
      upsert: false,
    });

  if (error) throw error;
  return { path: data.path, originalName: file.name, size: file.size };
}

export async function listMyPrivateRoms(user: User) {
  if (!supabase) throw new Error("O Supabase ainda não foi configurado neste ambiente.");

  const { data, error } = await supabase.storage.from(ROM_BUCKET).list(user.id, {
    limit: 100,
    sortBy: { column: "name", order: "desc" },
  });

  if (error) throw error;
  return data ?? [];
}

export async function deleteMyPrivateRom(user: User, objectPath: string) {
  if (!supabase) throw new Error("O Supabase ainda não foi configurado neste ambiente.");
  if (!objectPath.startsWith(`${user.id}/`)) {
    throw new Error("Caminho recusado: o arquivo não pertence à conta autenticada.");
  }

  const { error } = await supabase.storage.from(ROM_BUCKET).remove([objectPath]);
  if (error) throw error;
}
