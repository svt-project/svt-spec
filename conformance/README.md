# Conformance fixtures

This directory will contain language-neutral SVG inputs, typed bindings, expected discovered inputs,
diagnostics and substituted output expectations. No fixtures are implemented yet.

Compare semantic structure where XML serialization is allowed to change; do not accidentally require
attribute ordering, quote style or byte-identical formatting. Preserve meaningful text whitespace,
element order, geometry and references.

Cover root failures separately from scoped hook findings, conflicting keys, value-kind mismatches,
literal XML-sensitive text, default intent, shared colors and supplied image references. Keep native
renderer checks and authoring-tool round trips distinct from core conformance.

Use small original fixtures with explicit redistribution terms before publication. Do not import
private consumer artwork or generated preview corpora.
