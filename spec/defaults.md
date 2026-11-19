# Authored defaults

Using an authored default preserves original nodes and attributes, rather than reconstructing them
from discovery or interpretation results. Omitted bindings preserve content. Host policies own
complete assignment and unresolved selections; an unavailable selected resource must not silently
become omission. Explicit empty strings are values.

## Per-target evidence

Discovery reports **Present** with a raw string, or **Absent** with no raw string. Present includes
empty, malformed, unfamiliar and context-dependent property values. Raw means XML-processed text:
entity expansion and XML newline/attribute normalization apply, but no additional trimming,
normalization or interpretation occurs.

- Text concatenates direct character data and CDATA in order. Comments and processing instructions
  do not contribute. Text is always Present, including when empty.
- Paint reads only the marked direct `fill` or `stroke` attribute. An absent attribute remains
  Absent, even when rendering would supply or inherit a value.
- Image reads `href` when present, including empty; otherwise XLink `href`, otherwise Absent. See
  [image references](images.md). This is attribute precedence, not resolution.

Evidence identifies its source as TextContent, Fill, Stroke, Href or XLinkHref. Absent paint still
identifies Fill or Stroke; absent image has no source attribute. No computed style, implicit SVG
default, URI resolution or visibility inference is performed.

## Input summary

Each input retains ordered per-target evidence and one raw summary:

- **Common:** every target is Present and all strings are ordinally equal; expose that string.
- **Absent:** every target is Absent; no common string.
- **Mixed:** any other combination, including present plus absent; no common string.

`red` and `#ff0000` are Mixed even if an optional helper could interpret them as the same color.
Whitespace differences remain differences. All-empty values are Common with an empty string. Neither
Mixed nor Absent is a discovery error. Omission preserves every target independently.

Optional interpretation can help editors offer controls, but cannot replace this evidence or claim
to know rendered appearance. Opening and accepting a panel without an explicit edit must not
canonicalize authored values.

The agreed [per-target interpretation contract](interpretation.md) adds explicit, optional paint and
image operations; implementation is pending. Each result retains the original target evidence.
Interpretation does not replace the raw summary or add an interpreted aggregate: callers retain
target order and decide whether their controls consider interpreted values equivalent. In
particular, no byte quantization or approximate color comparison is implicit.
