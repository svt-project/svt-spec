# Contributing

Propose contract changes through issues and pull requests. Keep requirements, examples and expected
observations consistent. Explain behavioral effects and distinguish normative rules from informative
material. No editor, renderer or implementation's API is the definition of SVT.

Use Node.js 24 for repository checks. Format Markdown with
`npx --yes prettier@3.9.10 --write "**/*.md"`, then run `node eng/check.mjs`. Checks cover Markdown
formatting/local links and canonical asset inventory; they do not execute an SVT implementation or
fetch external links. Cross-implementation behavior needs separate runner evidence.

## Canonical reference assets

Keep small, original inputs and independently reviewed expectations under `conformance/`. Preserve
raw strings, diagnostic order, source units and explicit absence states. Read the
[fixture convention](conformance/README.md) before editing cases. Regenerate the inventory with
`node eng/assets.mjs --write` only for intentional changes and review the changed files and digest.

Identify a reviewed edition by its full Git commit and asset digest. A consumer records both when
copying the accepted snapshot, preserves its license, and explicitly reviews future updates. A spec
change does not require every consumer to adopt immediately. Published editions and asset snapshots
remain immutable; release tags/publication require separate authorization. No new edition changes
the namespace or format marker implicitly.

Preserve applicable authorship and legal attribution. Keep machine paths, private examples,
credentials and generated evidence out of the repository. See [LICENSE](LICENSE) and
[provenance](PROVENANCE.md).
