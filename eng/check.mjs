import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const remark = [
  "--yes",
  "--package=remark-cli@12.0.1",
  "--package=remark-gfm@4.0.1",
  "--package=remark-validate-links@13.1.0",
  "--package=remark-lint-no-undefined-references@5.0.2",
];
for (const [file, args] of [
  ["git", ["diff", "--check"]],
  ["git", ["diff", "--cached", "--check"]],
  ["node", ["--test", "eng/version.test.mjs"]],
  ["node", ["eng/assets.mjs"]],
  ["node", ["eng/fixtures.mjs"]],
  ["npx", ["--yes", "prettier@3.9.10", "--check", "**/*.md"]],
  [
    "npx",
    [
      ...remark,
      "remark",
      "--rc-path",
      ".remarkrc.cjs",
      "--ignore-path",
      ".prettierignore",
      "--frail",
      "--no-stdout",
      "--no-color",
      ".",
    ],
  ],
  ["npx", [...remark, "node", "eng/CheckDocumentationLinks.test.cjs"]],
]) {
  console.log(`> ${file} ${args.join(" ")}`);
  if (process.platform === "win32" && file === "npx")
    execFileSync(
      process.execPath,
      [resolve(dirname(process.execPath), "node_modules/npm/bin/npx-cli.js"), ...args],
      { cwd: root, stdio: "inherit" },
    );
  else execFileSync(file, args, { cwd: root, stdio: "inherit" });
}
