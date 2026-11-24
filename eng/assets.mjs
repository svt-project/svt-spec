import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { templateFormatForVersion } from "./version.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../conformance");
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
assert.ok(
  process.argv.length === 2 || (process.argv.length === 3 && process.argv[2] === "--write"),
);
const files = { LICENSE: hash(await readFile(resolve(root, "LICENSE"))) };
async function walk(relative) {
  const entries = await readdir(resolve(root, relative), { withFileTypes: true });
  assert.ok(entries.length, `Empty reference directory: ${relative}`);
  for (const entry of entries) {
    const name = `${relative}/${entry.name}`;
    if (entry.isDirectory()) await walk(name);
    else {
      assert.ok(entry.isFile(), `Reference must be a regular file: ${name}`);
      const bytes = await readFile(resolve(root, name));
      if (name.endsWith(".json")) JSON.parse(bytes.toString("utf8"));
      files[name] = hash(bytes);
    }
  }
}
for (const directory of ["inspection", "interpretation", "substitution"]) await walk(directory);
const sorted = Object.fromEntries(
  Object.entries(files).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
);
const sha256 = hash(
  Object.entries(sorted)
    .map(([name, digest]) => `${name}\0${digest}\n`)
    .join(""),
);
const edition = JSON.parse(await readFile(resolve(root, "../version.json"), "utf8"));
assert.equal(
  edition.template_format,
  templateFormatForVersion(edition.specification_version),
);
const manifest = { manifest_version: 1, ...edition, sha256, files: sorted };
const path = resolve(root, "manifest.json");
if (process.argv[2] === "--write") await writeFile(path, JSON.stringify(manifest, null, 2) + "\n");
else
  assert.deepEqual(
    JSON.parse(await readFile(path, "utf8")),
    manifest,
    "Canonical asset inventory changed; review and regenerate explicitly",
  );
console.log(`Verified ${Object.keys(files).length} canonical files: ${sha256}`);
