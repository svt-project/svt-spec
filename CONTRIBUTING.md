# Contributing

Propose contract changes through issues and pull requests. Keep requirements, examples and expected
observations consistent. Explain behavioral effects and distinguish normative rules from informative
material. No editor, renderer or implementation's API is the definition of SVT.

Use Node.js 24 for repository checks. Format Markdown with
`npx --yes prettier@3.9.10 --write "**/*.md"`, then run `node eng/check.mjs`. Checks cover edition
validation tests, Markdown formatting/local links and canonical asset inventory; they do not execute
an SVT implementation or fetch external links. Cross-implementation behavior needs separate runner
evidence.

## Canonical reference assets

Keep small, original inputs and independently reviewed expectations under `conformance/`. Preserve
raw strings, diagnostic order, source units and explicit absence states. Read the
[fixture convention](conformance/README.md) before editing cases. Regenerate the inventory with
`node eng/assets.mjs --write` only for intentional changes and review the changed files and digest.

Prepare editions using the [SemVer and template-format policy](spec/versions.md). Update
`version.json`, the changelog and the canonical manifest together. Use the highest compatibility
classification required by the changes; no patch changes the meaning of valid templates. Published
editions use immutable `v<specification_version>` tags, including candidate suffixes such as
`v1.0.0-rc.1`; never move a tag to include corrections. Review candidate contract changes explicitly
and record their adoption impact. Candidate status does not establish stable compatibility. Current
repository documentation may advance independently of a consumer's accepted snapshot.

A consumer records the specification edition, template format, full source commit and asset digest
when copying a snapshot, preserves its license, and explicitly reviews future asset updates.
Editorial changes do not require existing consumers to adopt a new snapshot. Ordinary documentation
links may point to current material; supported-contract claims identify the accepted edition and
provenance. Release tags/publication require separate authorization. Before tagging, verify a clean
reviewed commit, successful repository checks, agreement among `version.json`, changelog and
manifest, and whether the release is a candidate or stable edition. Mark candidate GitHub releases
as prereleases. Formal `1.0.0` also requires the
[coordinator acceptance gates](https://github.com/svt-project/.github/issues/9). Namespace changes
remain a separate decision.

Preserve applicable authorship and legal attribution. Keep machine paths, private examples,
credentials and generated evidence out of the repository. See [LICENSE](LICENSE) and
[provenance](PROVENANCE.md).
