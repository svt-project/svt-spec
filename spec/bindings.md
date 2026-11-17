# SVT bindings

This document defines the normative SVT binding syntax and inspection behavior.

## Document and annotations

An SVT document is well-formed XML with a root named `svg` in `http://www.w3.org/2000/svg`, carrying
the unnamespaced attribute `data-svt-version="0"`. The marker value is exact: no trimming, alternate
versions or development aliases. XML namespace prefix spelling is immaterial. DTDs are prohibited
and external entity resolution is disabled. Templates retain `.svg` filenames. Unknown non-SVT
content remains renderer-owned.

Only these unnamespaced, case-sensitive attributes carry SVT meaning:

| Attribute          | Value and meaning                             |
| ------------------ | --------------------------------------------- |
| `data-svt-version` | Root version marker                           |
| `data-svt-text`    | Text input key                                |
| `data-svt-image`   | Image input key                               |
| `data-svt-fill`    | Paint input key replacing direct `fill`       |
| `data-svt-stroke`  | Paint input key replacing direct `stroke`     |
| `data-svt-label`   | Display label shared by hooks on that element |

Keys are nonempty strings after XML attribute normalization. Compare ordinally; do not trim,
case-fold or impose an ASCII identifier grammar. Labels trim leading and trailing XML whitespace
(space, tab, CR, LF); missing or empty labels use the key. Labels never establish identity. Unknown
unnamespaced `data-svt-*` attributes produce a warning and no binding behavior. A version marker on
a descendant produces a warning; it does not introduce a nested template. A label without a hook is
inert. Foreign-namespaced lookalikes are not SVT annotations.

## Targets and conflicts

| Hook          | Compatible target                                                     |
| ------------- | --------------------------------------------------------------------- |
| Text          | Any SVG-namespace element without child elements                      |
| Image         | Any SVG-namespace element; replaces its reference attribute           |
| Fill / Stroke | Any SVG-namespace element; replaces its direct presentation attribute |

These are structural requirements, not SVG schema checks. Unknown SVG element names are allowed.
Text may contain character data, comments and processing instructions; replacement preserves the
non-character nodes. Foreign-namespace elements are incompatible targets.

Text and image keys each identify exactly one target. Fill and stroke share the Paint kind: a key
may occur at several targets, including fill and stroke on one element. Authored values may differ;
see [defaults](defaults.md). The first target supplies the effective input label. Differing labels
produce one warning at the first target, with only differing-label targets as related locations, but
do not reject a usable binding. Emit this warning only after the group passes ambiguity checks.

Process known hooks in document preorder, with hook order `text`, `image`, `fill`, `stroke` within
an element, independent of XML attribute order. Check target compatibility, then key presence. A
hook failing either check produces one error and is excluded before grouping. Group the remaining
hooks by exact key. Duplicate text/image targets or mixed kinds reject every member of that group.
Report one ambiguity error at its first hook, with the other hook locations as related locations.
Retain unrelated valid inputs.

Inputs appear in first-valid-target order. Targets within an input retain discovery order. An
invalid hook excluded before grouping cannot invalidate a compatible hook elsewhere.

## Binding semantics

Omission preserves authored content. An explicit value replaces every admitted target for its key.
Unknown keys fail by default; configured IgnoreWithWarning skips them with a warning. Rejected keys,
duplicate assignments, wrong value kinds and XML-unrepresentable replacements fail the complete
operation. No partial output or fallback to defaults is published. Each bind starts from the
immutable inspected template; previous results cannot affect later calls. See
[substitution](substitution.md) for policies, diagnostics and budgets.

Text is literal character data, including the empty string. Replacement preserves comments,
processing instructions and unrelated nodes and never interprets markup. Paint and image references
are raw strings, including empty strings. Encode text and attribute values through XML
serialization; do not validate paint syntax, URI syntax, SVG schemas or resource availability. XML
1.0 forbidden characters cannot be made representable by escaping and fail binding. Wrong value
kinds refer to binding target categories, not the semantic validity of their strings.

No CSS cascade evaluation or precedence repair occurs. A marked presentation attribute is authored
evidence, not effective paint. Styling may override it. Optional interpretation helpers never gate
inspection or replacement and never rewrite omitted values.

SVG retains geometry, transforms, clipping, paint order and text layout. XML serialization may
change lexical formatting; semantic preservation does not imply byte-identical output. Substitution
implementation is outside the first inspection slice.
