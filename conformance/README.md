# Conformance reference assets

These MIT-licensed assets describe portable observations for conforming SVT templates and binding
requests. See [LICENSE](LICENSE). Small root/format rejection cases also verify that processors do
not treat another document or unsupported marker as SVT. They prescribe no diagnostic details.

Conformance compares discovery, authored defaults, presentation and successful replacement output.
It does not compare parser error detection, diagnostics, source positions, malformed-input recovery,
resource thresholds, cancellation or API design. Implementations test those policies separately.
Their stricter behavior and richer diagnostics are permitted without becoming portable obligations.

Use an implementation's normal XML processor and configure operating limits sufficient for these
small cases. A resource refusal is not a passing semantic result; record unavailable capabilities or
an unexecuted case rather than silently skipping it. UTF-8 is the byte encoding used here.
Additional encoding and malformed-byte tests belong to implementation suites.

Compare XML semantically where lexical serialization may change. Preserve meaningful text
whitespace, comments, processing instructions, element order, geometry and references. Attribute
order, namespace prefix spelling, quote style, CDATA versus equivalent text, and empty-element
spelling are not equality requirements. Retain raw strings and namespace identities, and do not
normalize resource or paint values during comparison. Native renderer and editor tests are separate.

## Inspection fixture convention

Each case has `input.svg` and `expected.json`. JSON envelopes use `format_version: 0`. The fields
below define a projection of portable observations, not an implementation API or CLI response.
Runners map their implementation into this projection and omit implementation-specific fields. All
listed fields are present; absence is explicit JSON null. Object-property order is irrelevant; array
order and string values matter.

| Object            | Fields                                                                                                                                                                                                     |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inspection result | `format_version`: 0; `template_available`: boolean; `inputs`, `input_groups`: arrays                                                                                                                       |
| Input             | `key`, `label`: strings; `kind`: `text`, `image` or `paint`; `targets`: array; `default`: input default; `description`: string/null; `label_source`: `key`, `element` or `metadata`; `order`: integer/null |
| Target            | `hook`: `text`, `image`, `fill` or `stroke`; `element_name`: SVG local name; `default`: target default                                                                                                     |
| Target default    | `state`: `present` or `absent`; `raw`: string/null; `source`: `text_content`, `fill`, `stroke`, `href`, `xlink_href` or null                                                                               |
| Input default     | `state`: `common`, `mixed` or `absent`; `raw`: string/null                                                                                                                                                 |
| Input group       | `key`, `label`, `description`: string/null; `order`: integer/null; `input_keys`: ordered array of strings                                                                                                  |

Inputs and targets use structural discovery order; groups and their inputs use presentation order.
When no template is available, both arrays are empty. Present target evidence includes an empty
string; absent evidence has null raw. Absent paint still identifies fill or stroke; absent image has
null source. Only a Common summary has a non-null raw value. The unnamed group has null key, label,
description and order. Orders range from 0 through 2147483647.

There are no canonical diagnostic, location or budget-option fields. Root/marker cases assert only
that no supported template is returned; exceptions and diagnostic results may both be mapped to that
observation. For conforming cases, an unexpected failure fails the case regardless of its error
transport. Warnings do not alter the projected portable observations.

Cover entity-decoded keys, namespace aliases and scope, foreign metadata, nonbinding embedded
examples, text/CDATA, comments, processing instructions, empty versus absent values, mixed paint
strings and presentation order. Unknown SVG elements and unfamiliar paint/reference strings remain
eligible input content; the parser and renderer do not decide SVT property-value admission.

## Substitution fixture convention

Each case has `input.svg`, `bindings.json`, `expected.json` and `output.svg`. Both JSON files use
`format_version: 0`. Requests contain a `bindings` array of `key`, `kind` and `value`; kinds are
`text`, `paint`, `image_reference` and `image_content`. String values are literal replacements.
Image-content values are standard base64 and have a `media_type` string. The runner decodes those
bytes and maps the request to its own API. All requests in this corpus conform to the binding rules.

Expected results contain only `format_version` and `document_available: true`. Compare actual XML
with `output.svg` using semantic equality as described above. Also verify the byte-output policy
when byte export is available: UTF-8 without BOM, no XML declaration. An empty request is an
ordinary binding operation with no replacements, not a byte-for-byte copy instruction.

Malformed requests, unknown/duplicate keys, scoped-recovery policy, error order, output-budget
boundaries and cancellation are implementation tests, not this corpus's requirements.

## Optional interpretation fixture convention

`interpretation/cases.json` contains `format_version: 0` and a `cases` array. Each case has `hook`
(fill or image), nullable `raw`, expected `kind`, nullable `color` and nullable
`declared_media_type`. A null raw value means absent; an empty string means present and empty.
Colors are four numbers in R, G, B, A order, compared with absolute tolerance 1e-12. Kind spellings
follow the optional interpretation contract, for example `RequiresContext`.

The runner creates a conforming annotated SVG and interprets its discovered target. Preserve raw
evidence and its target association. Unsupported property syntax is valid raw SVG evidence and has a
defined optional classification; it is not malformed XML or a reason to reject inspection. There are
no budget overrides or exceeded-limit expectations in this corpus.

`interpretation/named-colors.json` records the fixed named-color keyword/hex facts from
[CSS Color 4, November 18, 2026](https://www.w3.org/TR/2026/CRD-css-color-4-20261118/#named-colors).
Exercise the complete table, aliases and ASCII casing. Other cases are original grammar, context,
reference and data-header examples. Interpretation never computes effective appearance, validates
encoded payloads or fetches resources.

## Edition changes and implementation policy

Candidate `1.0.0-rc.2` removes policy-only fixtures and diagnostic/location/budget fields from the
working corpus. The independent JSON envelope remains `0` during this prerelease revision; runner
updates accompany explicit adoption of the new edition. No dual-format reader is required. The
published `v1.0.0-rc.1` assets and existing stamped copies remain unchanged and can continue to
support implementation policy tests. See [implementation impact](../implementation-impact.md).

## Snapshot publication and adoption

[manifest.json](manifest.json) inventories canonical data and LICENSE by relative path and SHA-256.
The asset-set digest is SHA-256 of the UTF-8 concatenation of sorted `path`, NUL, lowercase file
digest and LF records. The manifest excludes this guide and itself.

It records the full SemVer edition and its major/minor template format. An immutable edition tag
names a published revision; a full source commit and asset digest identify an exact snapshot.
Implementations embed explicitly accepted stamped copies. Subsequent spec changes never update
consumer tests automatically. Preserve licenses and provenance when copying; do not fetch live
assets during builds or relabel earlier snapshots.
