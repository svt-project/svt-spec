# Conformance fixtures

This directory contains original language-neutral inspection fixtures in `inspection/`, covering raw
default evidence, conflict isolation, root rejection, invalid encoding and budget failures. The
fixtures are MIT-licensed; see [LICENSE](LICENSE). Implementation runners compare the structured
observations defined below. The `substitution/` fixtures exercise typed bindings and semantic XML
output.

Compare semantic structure where XML serialization is allowed to change; do not accidentally require
attribute ordering, quote style or byte-identical formatting. Preserve meaningful text whitespace,
element order, geometry and references.

Cover root failures separately from scoped hook findings, conflicting keys, value-kind mismatches,
literal XML-sensitive text, default intent, shared paints and supplied image references. Keep native
renderer checks and authoring-tool round trips distinct from core conformance.

Use small original fixtures with explicit redistribution terms before publication. Do not import
private consumer artwork or generated preview corpora.

## Inspection fixture convention

Each case has its own directory containing `input.svg` and `expected.json`, with optional
`options.json` for budget overrides. Malformed-byte cases may use `input.bin` instead of input.svg;
exactly one input file is present. JSON fixtures use `format_version: 0`.

The fixture schema below defines observations independently of implementation types or CLI output.
All listed expected fields are present; unavailable values use explicit JSON null, not omission.
Object-property order is insignificant. Array order, string values and enum spelling are
significant.

| Object            | Fields                                                                                                                                                                                                     |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inspection result | `format_version`: 0; `template_available`: boolean; `inputs`, `input_groups`, `diagnostics`: arrays                                                                                                        |
| Input             | `key`, `label`: strings; `kind`: `text`, `image` or `paint`; `targets`: array; `default`: input default; `description`: string/null; `label_source`: `key`, `element` or `metadata`; `order`: integer/null |
| Target            | `hook`: `text`, `image`, `fill` or `stroke`; `element_name`: SVG local-name string; `location`: location; `default`: target default                                                                        |
| Target default    | `state`: `present` or `absent`; `raw`: string/null; `source`: `text_content`, `fill`, `stroke`, `href`, `xlink_href` or null                                                                               |
| Input default     | `state`: `common`, `mixed` or `absent`; `raw`: string/null                                                                                                                                                 |
| Input group       | `key`, `label`, `description`: string/null; `order`: integer/null; `input_keys`: ordered array of string keys                                                                                              |
| Diagnostic        | `code`: string; `severity`: `error` or `warning`; `key`: string/null; `location`: location/null; `related_locations`: array of locations; `limit`: budget-name string/null                                 |
| Location          | `line`, `column`: positive integers using the [inspection location convention](../spec/inspection.md#diagnostic-model)                                                                                     |

Inputs and targets use structural discovery order; groups and their key references use presentation
order. Diagnostics and related locations use the specified diagnostic order. When no template is
available, inputs and groups are empty arrays. A present target's raw value is a string, including
empty; an absent target has null raw. Absent paint retains `fill` or `stroke` as its source; absent
image has null source. Only a common input default has a non-null raw string. The unnamed group has
null key, label, description and order. Orders, when present, are integers from 0
through 2147483647. Diagnostic messages are omitted because wording is not normative.

`options.json` contains `format_version: 0` and any positive-integer inspection budget overrides:
`MaxSourceBytes`, `MaxXmlCharacters`, `MaxElementDepth`, `MaxElements`, `MaxAttributesPerElement`,
`MaxHooks` and `MaxDiagnostics`. Omitted settings use the
[inspection profile values](../spec/inspection.md#configurable-inspection-budgets). These exact
names identify fixture settings and diagnostic limits; a runner maps them to its implementation's
configuration surface. They do not require CLR properties or a CLI wire format.

Boundary tests exercise limits at equality and immediately above, immutable ownership after caller
buffer mutation, cancellation, UTF-8/UTF-16 and invalid encodings, multiline/non-ASCII positions,
root failures, common/mixed/absent summaries and present/absent target evidence and conflict
isolation. Large boundary inputs may be generated deterministically in tests rather than committed
as bulky fixtures. Do not assert exact parser locations for invalid-byte sequences where the
contract leaves them unspecified.

Include empty attributes, malformed paint and URI strings, CSS expressions, unknown SVG elements,
Unicode keys and ordinal differences such as `red` versus `#ff0000`. These must remain discoverable
without value diagnostics. Cover mixed presence, conflicting labels retained with a warning, foreign
namespace targets and text child elements rejected structurally. Interpretation fixtures belong to
the optional helpers and must not become discovery admission tests.

## Substitution fixture convention

Each directory contains `input.svg`, `bindings.json` and `expected.json`. Successful cases also
contain `output.svg`, compared as XML with whitespace, comments and processing instructions
preserved. Lexical attribute order and quote style are not requirements.

Both JSON files contain `format_version: 0`. Requests contain an ordered `bindings` array of `key`,
`kind` and `value`. Kinds are `text`, `paint`, `image_reference` and `image_content`.
Encoded-content values are base64 bytes and include `media_type`. Expected results contain
`document_available` and ordered structured `diagnostics` using the inspection fixture field
conventions, without messages. Fixtures use default configuration; generated boundary tests cover
configurable policies and limits. For `text`, `paint` and `image_reference`, `value` is a raw
string. For `image_content`, `value` is a base64 string and the assignment also has a `media_type`
string. Keys are strings; array order is assignment order. The default profile rejects unknown keys
and uses the [substitution budget values](../spec/substitution.md#budgets). A runner must select
this profile even when its host normally uses different settings.

## Interpretation fixture convention

The optional interpreter uses `interpretation/cases.json`: format_version 0 with ordered cases
containing hook (fill or image), nullable raw evidence, nullable options using public budget names,
expected kind, nullable normalized RGBA color array, declared_media_type and exceeded_limit. These
are fixture fields, not additions to CLI output. The runner creates an ordinary annotated SVG,
inspects it, and interprets the resulting target through the public API. Every case checks target
identity and raw preservation; colors use the contract's absolute tolerance of 1e-12.

Every case contains `hook`, `raw`, `options`, `kind`, `color`, `declared_media_type` and
`exceeded_limit`. A null raw value means an absent attribute; an empty string means present and
empty. `options` is null or an object of positive-integer overrides using the exact names in the
[interpretation budget profile](../spec/interpretation.md#budgets-and-precedence); omitted values
use that profile. `color` is null or four numbers in R, G, B, A order. `declared_media_type` is a
string or null. Unlike inspection enums, interpretation kind and exceeded-limit strings use the
PascalCase spellings in the interpretation contract (for example `RequiresContext` and
`NumericTokenCharacters`). These fixture spellings are independent of a runner's enum names.

`interpretation/named-colors.json` records the fixed named-color keyword/hex facts from
[CSS Color 4, November 18, 2026](https://www.w3.org/TR/2026/CRD-css-color-4-20261118/#named-colors).
The runner covers the complete table, aliases and ASCII casing. Other fixtures are independently
authored grammar, context, resource, header and budget examples. Generated tests cover large
payloads, deep nesting, nullable/argument boundaries, cancellation, culture, concurrent reuse and
independence from binding. They do not compute effective appearance or fetch resources.

## Snapshot publication and adoption

[manifest.json](manifest.json) inventories the canonical data and license by relative path and
SHA-256. The asset-set digest is SHA-256 of the UTF-8 concatenation of sorted `path`, NUL, lowercase
file digest, and LF records. The manifest excludes this explanatory README and itself.

The manifest records the full SemVer specification edition, including any prerelease suffix, and its
major/minor template format. For example, edition `1.0.0-rc.1` still targets template format `1.0`.
An immutable edition tag names the published revision; a full source commit and asset-set digest
identify the exact snapshot. Existing snapshots are never rewritten or retroactively relabeled.
Identical asset bytes may occur in several editions; their shared asset digest does not replace
edition/commit provenance. Editorial patch revisions do not change the template marker or require
consumers to refresh unchanged assets.

Implementations copy or embed the selected files and record the source repository, specification
edition, template format, full commit, asset digest, license/attribution and intentional exclusions.
They run their own adapters against these references and retain implementation-specific regression
tests separately. Adoption is an explicit reviewed change; ordinary builds need no network access to
this repository.

Run `node eng/assets.mjs` to verify the inventory, and `node eng/assets.mjs --write` only when
deliberately preparing a revised asset set. Review changed cases, expected behavior and the manifest
together. An inventory check verifies captured bytes; implementation runners establish conformance.
