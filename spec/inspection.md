# Inspection diagnostics and limits

Inspection accepts XML bytes and returns either an immutable template plus scoped diagnostics, or no
template plus a root failure. A usable template may have errors on rejected hooks; independently
valid inputs remain available. This is tolerant inspection, not strict authoring certification.

Support UTF-8 and UTF-16 XML encodings, including their optional byte-order marks, using XML
encoding detection. Reject other declared encodings. Invalid byte sequences are errors, never
replacement characters. XML 1.0 processing is required; duplicate attributes are malformed XML. DTD
declarations are rejected and external resolution is disabled. Cancellation must remain distinct
from malformed input and must not return a partial result. Implementations document how their APIs
signal cancellation.

## Diagnostic model

Each diagnostic has a stable string code, severity, human-readable message, optional input key,
optional primary source location and ordered related locations. Messages are explanatory and are not
a parsing or conformance contract. Codes and structured fields are the machine interface.

Locations use one-based line and column numbers. Columns count UTF-16 code units, including a tab as
one unit; CRLF counts as one line break. This convention is explicit for non-.NET consumers. Hook
locations identify the start of the attribute name; element locations identify the start of the
element name. These are points, not byte spans. Root parsing failures use the parser-reported point
when available; failures before parsing may have no location. Invalid-byte failure locations are not
guaranteed. Related locations preserve discovery order.

| Code                     | Severity | Effect                                                                                          |
| ------------------------ | -------- | ----------------------------------------------------------------------------------------------- |
| `svt.xml.invalid`        | Error    | No template                                                                                     |
| `svt.xml.encoding`       | Error    | Unsupported declared encoding; no template                                                      |
| `svt.xml.dtd`            | Error    | Prohibited DTD; no template                                                                     |
| `svt.root.invalid`       | Error    | Wrong root namespace/name; no template                                                          |
| `svt.version.invalid`    | Error    | Missing, malformed or unsupported root marker; no template                                      |
| `svt.limit.exceeded`     | Error    | No template; structured `limit` identifies the exceeded option                                  |
| `svt.hook.target`        | Error    | Reject incompatible hook                                                                        |
| `svt.hook.key`           | Error    | Reject empty-key hook                                                                           |
| `svt.input.ambiguous`    | Error    | Reject all conflicting group members                                                            |
| `svt.input.labels`       | Warning  | Without a central label, retain first target label; related locations identify differing labels |
| `svt.annotation.unknown` | Warning  | Ignore unknown SVT annotation                                                                   |
| `svt.version.nested`     | Warning  | Ignore descendant version marker                                                                |

The [metadata contract](metadata.md#diagnostics-and-recovery) defines the warning codes
`svt.metadata.container`, `svt.metadata.duplicate`, `svt.metadata.input`, `svt.metadata.group`,
`svt.metadata.invalid` and `svt.metadata.unknown`. Its recovery rules define label precedence,
declaration rejection and field-level fallback without changing hook admission.

Scoped diagnostics sort by primary source position, then code ordinally for ties. Ambiguity
locations identify the first admitted group member. Root/limit failures return one terminal
diagnostic and no partial discovery findings. If multiple faults exist, report the first encountered
by bounded XML parsing; after a successful parse check root name before version, then inspect hooks
and resolve metadata. Defer inline-label conflict findings until central label resolution is known.
Metadata warnings share the diagnostic budget and final ordering with hook findings.

## Configurable inspection budgets

Defaults are operational policy, not format restrictions or performance guarantees. Callers may
raise or lower each positive integer limit explicitly; invalid options are programming errors. There
is no unlimited sentinel. A value exactly equal to a limit is permitted.

The table defines the named budget profile used by the conformance references. Implementations may
expose different configuration APIs and host defaults; fixture runs must select these values unless
the fixture overrides them. Counting units, equality and terminal-failure semantics remain portable.
A different host budget does not change the template grammar or authorize unbounded parsing. Each
implementation owns compatibility promises for its host defaults.

| Option                    | Default    | Counting rule                                                                                         |
| ------------------------- | ---------- | ----------------------------------------------------------------------------------------------------- |
| `MaxSourceBytes`          | 16,777,216 | Supplied byte count, including BOM                                                                    |
| `MaxXmlCharacters`        | 16,777,216 | Decoded UTF-16 code units before XML newline/entity normalization, including markup but excluding BOM |
| `MaxElementDepth`         | 64         | Root is depth 1; element nesting only                                                                 |
| `MaxElements`             | 100,000    | All elements, including unmarked artwork                                                              |
| `MaxAttributesPerElement` | 256        | All attributes, including namespace declarations                                                      |
| `MaxHooks`                | 10,000     | All occurrences of the four known hook attributes, even invalid hooks                                 |
| `MaxDiagnostics`          | 1,000      | Scoped errors and warnings before terminal rejection                                                  |

Apply byte limits before copying input; enforce structural limits during streaming XML parsing,
before constructing an unbounded tree. Discovery and grouping must be linear apart from bounded
diagnostic and presentation ordering; no recursive filesystem or SVG dependency traversal is
allowed. Metadata counts toward all applicable budgets, including hooks excluded from discovery
inside SVG metadata. Check cancellation before work and at element/discovery, metadata-resolution
and sorting boundaries. These budgets do not bound native decoding or pixel allocation because
inspection performs neither.

When the next scoped diagnostic would exceed the diagnostic budget, discard the partial inspection
and return a single `svt.limit.exceeded` with `limit=MaxDiagnostics`. Treat other budget failures
the same way. Count decoded characters at the decoding boundary; do not classify budget failures by
localized XML exception-message text. A parser's own character budget may provide an additional
defense but is not the definition of this counter.

SVG schema and property-value validation are outside core. Malformed paint and URI values do not
produce discovery errors or warnings. Optional interpretation is separate from discovery. Encoded
replacement byte limits and bound-output limits belong to substitution, not this inspection API.
