# SVT substitution

This contract defines substitution behavior. The [.NET binding API](../docs/binding-api.md) defines
the public surface and identifies the agreed caller-buffer export extension awaiting implementation.
Inspection remains independent of substitution and optional value interpretation.

## Admission and atomicity

Omission preserves original content, including differing defaults across shared paint targets. Empty
strings are explicit replacements. There is no default/unassigned sentinel, completeness
requirement, silent overwrite policy or general continue-on-error mode.

Bind operates only on admitted inputs. Unrelated scoped inspection errors do not prevent binding. An
admitted key takes precedence over invalid hooks excluded during inspection: those excluded hooks
remain untouched. Inspection must retain rejected-key evidence internally without exposing rejected
inputs as usable inputs.

Unknown supplied keys produce `svt.binding.unknown`: Error by default, or Warning with the
assignment ignored under IgnoreWithWarning. A key with rejected hooks but no admitted input is
rejected, not unknown. Rejected keys, duplicates (even identical assignments), wrong kinds and
XML-unrepresentable replacement values for admitted inputs are errors. Ignored unknown assignments
skip kind and value validation, but remain subject to budgets and duplicate-key rejection.

All submitted assignments count toward input budgets, including ignored assignments. A successful
operation publishes one complete document under the selected admission policy. Any error means no
document. Binding cancellation and failures never expose a partial document. Hosts control
subsequent saving or rendering; successful binding does not certify resource safety or rendering
behavior, or make downstream publication transactional.

## Output preservation

Every bind starts from the independently captured source. Preserve SVT annotations, meaningful text
whitespace, comments, processing instructions, unrelated nodes, geometry and references. Text
replacement changes direct character data and CDATA, not markup. Paint changes only the selected
direct attributes. Image attribute handling follows [images](images.md).

For nonempty text replacement, insert the new character data at the first original direct text or
CDATA node's position and remove the remaining direct character-data nodes. Preserve comments and
processing instructions and their relative order. When no character data exists, append replacement
text after existing non-character nodes. Empty replacement removes direct character data without
adding a text node. Whitespace-only text is character data and participates in these rules.

For example, `<!--before-->old<?note keep?>tail<!--after-->` becomes
`<!--before-->new<?note keep?><!--after-->` when replaced with `new`.

Output uses UTF-8 without BOM when exported as bytes, omits the XML declaration, and offers no
pretty-printing option. Empty binding lists follow the same serialization policy. Lexical formatting
may change; character values must survive reparsing, including carriage returns and attribute tabs.
No CSS evaluation, resource resolution, color normalization or annotation stripping occurs.

### Caller-owned byte output

The agreed [.NET output export contract](../docs/binding-api.md#output-export) adds exact UTF-8
sizing and writing into caller-owned storage after successful binding. Its bytes must equal the
allocating export, and insufficient destination capacity must leave that destination unchanged. The
immutable document retains no destination memory and remains independently reusable. This is an
output API extension, not a template-format change or a new binding mode.

The output budget is enforced before the completed document becomes available, not deferred until
export. Export adds no configuration, diagnostics, cancellation or resource access. Successful
binding and bounded byte export do not guarantee atomic publication by a later host operation.

## Validation order

After programming-argument checks and bounded assignment capture, apply these phases in order:

1. Enforce all submitted-value and image budgets before semantic validation, including values on
   unknown or duplicate keys. Count limits apply before capture; output and diagnostic limits apply
   in their respective later phases.
2. Identify duplicate ordinal-key groups. Reject each group once at its first assignment, including
   unknown keys and empty keys. Skip individual semantic validation for every member of that group.
3. Validate remaining assignments in supplied order: empty key, admitted/rejected/unknown lookup,
   kind, then XML representability. Stop at the first finding for each assignment. IgnoreWithWarning
   produces an unknown-key warning and skips further validation of that assignment. Its value is
   never serialized. Continue checking other assignments within the diagnostic budget.
4. Construct and serialize output only when request validation has no errors. Enforce the output
   budget before exposing a document.

Image creation checks encoded-byte limit, media-type length, then media-type grammar before copying
bytes. It reports the first failure. Null arguments remain programming errors; cancellation remains
cancellation throughout all phases.

## Diagnostics

Reuse the inspection diagnostic model. Binding results contain findings from this attempt only;
inspection findings remain in InspectionResult. Known-key locations point to original hook
attributes, with other relevant targets in discovery order as RelatedLocations. Unknown keys and
image-creation failures have no template locations. Diagnostic Key is the supplied key when
applicable. Limit is non-null only for budget failures, using the exact public option name.

| Code                    | Meaning                                                     | Effect                                               |
| ----------------------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| `svt.binding.key`       | Empty assignment key                                        | Error; no document                                   |
| `svt.binding.unknown`   | Key is not known to inspection                              | Error, or warning and ignore under configured policy |
| `svt.binding.rejected`  | Key has no admitted input but has rejected hooks            | Error; no document                                   |
| `svt.binding.duplicate` | Multiple assignments for the same ordinal key               | Error; no document                                   |
| `svt.binding.kind`      | Replacement kind differs from input kind                    | Error; no document                                   |
| `svt.binding.value`     | Replacement is not representable in XML 1.0                 | Error; no document                                   |
| `svt.image.media-type`  | Encoded-image media type is outside the convenience grammar | Error; no image                                      |
| `svt.limit.exceeded`    | Positive budget exceeded                                    | One terminal error; no image or document             |

Binding diagnostics sort by assignment index, then code ordinally for ties. Messages are
explanatory, not machine contracts. Image creation returns the first failure. If the next diagnostic
exceeds MaxDiagnostics, return only the terminal limit diagnostic. Other budget failures likewise
discard accumulated findings. Warnings count toward MaxDiagnostics.

## Budgets

Defaults are operational policy, not format restrictions. All limits are positive integers; equality
is allowed and there is no unlimited sentinel. Use overflow-safe accounting. Configuration is
immutable and reusable, but limits apply per operation, not to application-wide retained objects or
concurrent work.

| Option                    | Default    | Counting rule                                                                                                      |
| ------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------ |
| MaxEncodedImageBytes      | 16,777,216 | Encoded content bytes per image, checked before capture and again during binding                                   |
| MaxMediaTypeCharacters    | 256        | UTF-16 units in the supplied media type, checked at creation and against binding configuration                     |
| MaxBindings               | 10,000     | All submitted assignments, before list capture                                                                     |
| MaxValueCharacters        | 1,048,576  | Each key or raw string payload individually, in UTF-16 units before XML escaping                                   |
| MaxTotalValueCharacters   | 8,388,608  | Sum of every submitted key and raw string payload, including duplicates and ignored assignments                    |
| MaxTotalEncodedImageBytes | 33,554,432 | Encoded bytes summed per assignment, even when an image object is reused                                           |
| MaxOutputBytes            | 67,108,864 | Complete serialized UTF-8 output, including repeated targets, escaping, base64 and duplicated reference attributes |
| MaxDiagnostics            | 1,000      | Errors and warnings accumulated before terminal rejection                                                          |

Image options own the first two limits; binding options own the others. Media types are governed by
their own limit; generated base64 is excluded from raw string budgets. Empty values contribute zero
units but still count as assignments. Raw data URLs supplied as image references are string
payloads, not encoded-content objects, and therefore use the string budgets.

Enforce output limits during bounded serialization, before constructing an oversized output. A
shared replacement is charged once to submitted-value budgets but every emitted target counts toward
output bytes. A successful image capture does not reserve binding capacity or bypass stricter later
configuration. The output limit exceeds default inspection limits; reinspecting a large output may
require explicitly raised inspection budgets.

## Conformance obligations

Verify repeated and concurrent binding independence, caller-buffer ownership, unknown-key policies,
rejected-key distinction, duplicates, kind errors, omission versus empty values, and exact raw value
preservation. Exercise each budget at equality and immediately above, including output expansion and
reused image objects under stricter configuration. Verify no partial output, deterministic
diagnostics, cancellation without sleeps, XML-sensitive characters, comment/processing-instruction
preservation and placement, mixed-fault validation precedence, ignored unknown values, image
reference precedence and matching updates to existing XLink attributes. Keep renderer evidence
separate from portable substitution conformance.

For the caller-buffer extension, verify exact byte/count equivalence across Unicode (including
supplementary characters), XML-sensitive text, empty values, encoded-image URLs and preserved XML
structure. Cover empty/default, exact, one-byte-short and oversized spans, sliced destinations with
sentinel bytes, unchanged storage on insufficient capacity, and unchanged suffixes on success.
Verify repeated and concurrent exports into disjoint storage, mutation independence, and mixed use
with Xml and newly allocated ToUtf8Bytes results. Check output-budget equality and rejection below
the required size during Bind; an oversized destination must not change that admission policy.
Measure export allocations and throughput separately from binding and destination allocation for
small and near-budget documents; preserve the distinction from native renderer performance.
