import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Usage: node scripts/run-with-supabase-db.mjs <command...>");
  process.exit(1);
}

const configure = spawnSync("node", ["scripts/supabase-db-env.mjs", "--write"], {
  cwd: root,
  stdio: "inherit",
});

if (configure.status !== 0) process.exit(configure.status ?? 1);

function parseEnv(content) {
  const map = {};
  for (const line of content.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    map[k] = v;
  }
  return map;
}

const envMap = parseEnv(readFileSync(join(root, ".env"), "utf8"));
const child = spawnSync(args[0], args.slice(1), {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, ...envMap },
});

process.exit(child.status ?? 1);
