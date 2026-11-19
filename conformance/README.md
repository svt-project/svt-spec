# Conformance fixtures

This directory contains original language-neutral inspection fixtures in `inspection/`, covering raw
default evidence, conflict isolation, root rejection, invalid encoding and budget failures. The
fixtures are MIT-licensed under the repository LICENSE. The MSTest fixture runner compares all
structured fields through the public inspection API. The `substitution/` fixtures exercise typed
bindings and semantic XML output.

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

Expected output contains `template_available`, structural `inputs`, ordered `input_groups` with key
references, and ordered `diagnostics`. Presentation fields and explicit nulls match
[CLI discovery JSON](../spec/cli.md#discovery-json). Use snake_case field names corresponding to the
[inspection model](../docs/inspection-api.md), snake_case enum values and explicit nulls for
unavailable values. Raw evidence is a JSON string, including the empty string; source values are
`text_content`, `fill`, `stroke`, `href` and `xlink_href`. Omit diagnostic messages because parser
wording is not normative. Source locations contain `line` and `column`; related locations retain
order. Options use the exact public budget names plus the fixture format marker. These JSON files
describe test expectations, not a published CLI wire protocol.

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
configurable policies and limits.

## Interpretation fixture convention

The optional interpreter uses `interpretation/cases.json`: format_version 0 with ordered cases
containing hook (fill or image), nullable raw evidence, nullable options using public budget names,
expected kind, nullable normalized RGBA color array, declared_media_type and exceeded_limit. These
are fixture fields, not additions to CLI output. The runner creates an ordinary annotated SVG,
inspects it, and interprets the resulting target through the public API. Every case checks target
identity and raw preservation; colors use the contract's absolute tolerance of 1e-12.

`interpretation/named-colors.json` records the fixed named-color keyword/hex facts from
[CSS Color 4, November 18, 2026](https://www.w3.org/TR/2026/CRD-css-color-4-20261118/#named-colors).
The runner covers the complete table, aliases and ASCII casing. Other fixtures are independently
authored grammar, context, resource, header and budget examples. Generated tests cover large
payloads, deep nesting, nullable/argument boundaries, cancellation, culture, concurrent reuse and
independence from binding. They do not compute effective appearance or fetch resources.

The [host editor example](../examples/editor/README.md) is also compiled into behavioral tests and
the isolated package consumer. Its separate interaction checks establish that chooser
initialization, quantization and unchanged/canceled interactions do not become implicit bindings.
These are host intent tests, not additional color grammar, inspection admission rules or
documentation wording tests.

## CLI validation

The CLI test project also executes the inspection and substitution fixtures through the real command
entry point. It compares discovery data, structured diagnostics and semantic XML output, while
checking exit status and separating stdout results from stderr diagnostics. Fixture options are
translated explicitly into CLI configuration; the fixture envelope is not an additional CLI format.

Additional tests generate small isolated requests for strict JSON and Unicode, configuration
precedence, stdin ownership, relative image acquisition, admission policies, resource limits and
publication behavior. File tests cover resolved input collisions, symbolic links, distinct hard
links, filesystem case behavior, overwrite races and preservation of existing output. Staging
boundaries and controlled streams exercise cancellation and reporting failures without timing-based
polling. Native rendering and authoring-tool round trips remain separate evidence.

## Authoring examples

The [authoring corpus](../examples/authoring/README.md) adds independently authored visual examples,
raw inventories and expected SVGs. The API/CLI tests exercise these alongside portable conformance.
The [native runner](../eng/visual/README.md) separately records editor round trips, resource
readiness and rendered comparisons; its reports are not portable conformance fixtures.
