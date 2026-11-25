# SVT substitution

Substitution applies supplied values to the named inputs of a conforming template. Implementations
map this operation to their own APIs; inspection and optional value interpretation remain separate.

## Binding requests

A conforming request supplies at most one assignment per key, refers only to discovered inputs, and
supplies the matching value kind. Text and paint values are strings; image values are raw references
or the [encoded-content convenience](images.md). Replacement strings must be representable in XML
1.0. Unknown keys, repeated assignments, wrong kinds and unrepresentable values are outside the
request contract; implementations define their failure or recovery policy. They must not insert
replacement strings as unescaped markup or report malformed generated XML as a successful binding of
a conforming request.

Omission preserves original content, including different authored defaults across shared paint
targets. An empty string is an explicit replacement. No completeness requirement, default sentinel
or implicit assignment is introduced. Each supplied value replaces every target of its input.

Every bind starts from the independently captured source; earlier results do not affect later
bindings. A successful operation returns one complete document. Errors, cancellation and operational
limits must not be presented as successful partial output. Hosts own saving, rendering and
publication; binding does not make those later operations transactional.

## Output preservation

Preserve SVT annotations, meaningful text whitespace, comments, processing instructions, unrelated
nodes, geometry and references. Text replacement changes direct character data and CDATA, not
markup. Paint changes only the selected direct attributes. Image attribute handling follows
[images](images.md). Omitted targets retain their authored content rather than a reconstruction from
interpreted defaults.

For nonempty text replacement, insert the new character data at the first original direct text or
CDATA node's position and remove the remaining direct character-data nodes. Preserve comments and
processing instructions and their relative order. When no character data exists, append replacement
text after existing non-character nodes. Empty replacement removes direct character data without
adding a text node. Whitespace-only text is character data and participates in these rules.

For example, `<!--before-->old<?note keep?>tail<!--after-->` becomes
`<!--before-->new<?note keep?><!--after-->` when replaced with `new`.

Output uses UTF-8 without BOM when exported as bytes and omits the XML declaration. Empty binding
lists follow the same output policy. Lexical formatting may change; character values must survive
reparsing, including carriage returns and attribute tabs. Formatting must not add, remove or change
meaningful text. No CSS evaluation, resource resolution, color normalization or annotation stripping
occurs.

A DOM serializer or bounded source-slice assembly can implement these rules. The format does not
require a mutable tree, cloning strategy or particular XML serialization library. Literal escaping
must respect text versus attribute context; XML 1.0 forbidden characters are not made legal by
escaping.

## Implementation policy

Diagnostics, assignment-validation order, duplicate/unknown-key policies, recovery, input ownership,
image capture, budgets and cancellation are documented by each implementation. There is no portable
requirement for diagnostic codes, rejected-key distinctions, warning counts or precise failure
precedence. See [the processing boundary](inspection.md#diagnostics-and-operational-controls).

Implementations enforce operational controls appropriate to their host, including output expansion
from repeated replacements, XML escaping and base64. Such controls apply to invalid requests too.
The specification does not prescribe their counters, threshold values or accounting algorithm.

## Conformance obligations

Verify conforming requests for omission versus empty values, literal XML-sensitive text, unchanged
unrelated content, repeated binding independence, shared paints, image reference precedence and
matching updates to existing XLink attributes. Compare semantic XML, preserving meaningful
whitespace, comments, processing instructions and replacement placement. Attribute order, quote
style and empty-element spelling are not conformance observations.

Keep malformed-request, diagnostic, cancellation and resource-boundary tests with implementation
policy. Keep renderer evidence separate from portable substitution conformance.
