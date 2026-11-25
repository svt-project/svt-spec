// Validate the portable observation envelope independently of implementation-specific APIs.
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../conformance/", import.meta.url));
const read = async (path) => JSON.parse(await readFile(root + path, "utf8"));
function keys(value, expected, path) {
  assert.deepEqual(Object.keys(value).sort(), expected.split(" ").sort(), path);
}
let inspections = 0,
  bindings = 0;
for (const name of await readdir(root + "inspection")) {
  const path = `inspection/${name}`,
    r = await read(path + "/expected.json");
  keys(r, "format_version template_available inputs input_groups", path);
  assert.equal(r.format_version, 0);
  assert.equal(typeof r.template_available, "boolean");
  assert.ok(Array.isArray(r.inputs));
  assert.ok(Array.isArray(r.input_groups));
  await readFile(root + path + "/input.svg");
  if (!r.template_available) {
    assert.equal(r.inputs.length, 0);
    assert.equal(r.input_groups.length, 0);
  }
  for (const i of r.inputs) {
    keys(i, "key label kind targets default description label_source order", path);
    assert.ok(["text", "image", "paint"].includes(i.kind));
    assert.ok(i.targets.length > 0);
    keys(i.default, "state raw", path);
    assert.ok(["common", "mixed", "absent"].includes(i.default.state));
    assert.equal(i.default.raw !== null, i.default.state === "common");
    for (const t of i.targets) {
      keys(t, "hook element_name default", path);
      assert.ok(["text", "image", "fill", "stroke"].includes(t.hook));
      keys(t.default, "state raw source", path);
      assert.ok(["present", "absent"].includes(t.default.state));
      assert.equal(t.default.raw !== null, t.default.state === "present");
    }
  }
  for (const g of r.input_groups) keys(g, "key label description order input_keys", path);
  assert.deepEqual(
    r.input_groups.flatMap((g) => g.input_keys).sort(),
    r.inputs.map((i) => i.key).sort(),
    path + " presentation membership",
  );
  inspections++;
}
for (const name of await readdir(root + "substitution")) {
  const path = `substitution/${name}`,
    r = await read(path + "/expected.json"),
    request = await read(path + "/bindings.json");
  keys(r, "format_version document_available", path);
  assert.equal(r.format_version, 0);
  assert.equal(r.document_available, true);
  keys(request, "format_version bindings", path);
  assert.equal(request.format_version, 0);
  assert.equal(
    new Set(request.bindings.map((b) => b.key)).size,
    request.bindings.length,
    path + " duplicate assignment",
  );
  for (const b of request.bindings) {
    keys(b, b.kind === "image_content" ? "key kind value media_type" : "key kind value", path);
    assert.ok(["text", "paint", "image_reference", "image_content"].includes(b.kind));
    assert.equal(typeof b.value, "string");
  }
  await readFile(root + path + "/input.svg");
  await readFile(root + path + "/output.svg");
  bindings++;
}
const interpretation = await read("interpretation/cases.json");
keys(interpretation, "format_version cases", "interpretation");
assert.equal(interpretation.format_version, 0);
for (const c of interpretation.cases) {
  keys(c, "hook raw kind color declared_media_type", "interpretation");
  assert.ok(["fill", "image"].includes(c.hook));
  if (c.color !== null) {
    assert.equal(c.kind, "Literal");
    assert.equal(c.color.length, 4);
    assert.ok(c.color.every((n) => Number.isFinite(n) && n >= 0 && n <= 1));
  }
}
console.log(
  `Portable envelopes: ${inspections} inspection, ${bindings} substitution, ${interpretation.cases.length} interpretation cases.`,
);
