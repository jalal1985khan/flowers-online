/**
 * Builds Supabase Postgres URLs for Prisma from NEXT_PUBLIC_SUPABASE_URL + SUPABASE_DB_PASSWORD.
 * Usage: node scripts/supabase-db-env.mjs [--write]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env");

function parseEnvFile(content) {
  const map = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    map[key] = val;
  }
  return map;
}

function serializeEnvFile(content, updates) {
  const lines = content.split("\n");
  const seen = new Set();
  const out = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return line;
    const eq = trimmed.indexOf("=");
    if (eq === -1) return line;
    const key = trimmed.slice(0, eq).trim();
    if (key in updates) {
      seen.add(key);
      return `${key}="${updates[key]}"`;
    }
    return line;
  });
  for (const [key, val] of Object.entries(updates)) {
    if (!seen.has(key)) out.push(`${key}="${val}"`);
  }
  return out.join("\n").replace(/\n?$/, "\n");
}

function projectRefFromSupabaseUrl(url) {
  const match = url.match(/https:\/\/([a-z0-9]+)\.supabase\.co/i);
  if (!match) throw new Error("Invalid NEXT_PUBLIC_SUPABASE_URL");
  return match[1];
}

function buildDatabaseUrls(ref, password) {
  const encoded = encodeURIComponent(password);
  const direct = `postgresql://postgres:${encoded}@db.${ref}.supabase.co:5432/postgres`;
  return { direct };
}

const write = process.argv.includes("--write");
const envContent = readFileSync(envPath, "utf8");
const env = parseEnvFile(envContent);

const password = env.SUPABASE_DB_PASSWORD || process.env.SUPABASE_DB_PASSWORD;
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!supabaseUrl) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL in .env");
  process.exit(1);
}

if (!password) {
  console.error(
    "Missing SUPABASE_DB_PASSWORD. Add it to .env from Supabase Dashboard → Project Settings → Database → Database password."
  );
  process.exit(1);
}

const ref = projectRefFromSupabaseUrl(supabaseUrl);
const { direct } = buildDatabaseUrls(ref, password);

// Use direct connection (reliable for Prisma migrate/push). For serverless at scale, paste
// the Transaction pooler URI from Supabase Dashboard into DATABASE_URL manually.
const updates = {
  DATABASE_URL: env.DATABASE_URL?.includes("pooler.supabase.com") ? env.DATABASE_URL : direct,
  DIRECT_URL: direct,
  SUPABASE_PROJECT_REF: ref,
};

if (write) {
  writeFileSync(envPath, serializeEnvFile(envContent, updates));
  console.log("Updated .env with Supabase DATABASE_URL and DIRECT_URL.");
} else {
  console.log(JSON.stringify(updates, null, 2));
}
