# SVT bindings

This document defines the normative SVT binding syntax and inspection behavior.

## Document and annotations

An SVT document is well-formed XML with a root named `svg` in `http://www.w3.org/2000/svg`, carrying
the unnamespaced attribute `data-svt-version="1.0"`. The marker value is exact: no trimming,
alternate versions or development aliases. XML namespace prefix spelling is immaterial. Conforming
templates have no DTD; external resolution is disabled as described in the
[XML processing boundary](inspection.md#xml-processing-boundary). Templates retain `.svg` filenames.
Unknown non-SVT content remains renderer-owned.

These unnamespaced, case-sensitive attributes define binding annotations. Optional structured
[presentation metadata](metadata.md) uses a separate namespace without changing these hooks:

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
(space, tab, CR, LF); missing or empty inline labels use the key. Labels never establish identity.
Unknown unnamespaced `data-svt-*` attributes have no binding behavior. A version marker on a
descendant does not introduce a nested template. Implementations may diagnose these annotations
without changing their defined meaning. A label without a hook is inert. Foreign-namespaced
lookalikes are not binding annotations. SVG `metadata` elements and their subtrees are excluded from
binding-annotation interpretation under the
[metadata contract](metadata.md#vocabulary-and-placement).

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
see [defaults](defaults.md). A valid central label overrides inline labels under the
[metadata precedence rules](metadata.md#values-and-resolution). Otherwise the first target supplies
the effective input label, even if later targets have different inline labels.

Process known hooks in document preorder, with hook order `text`, `image`, `fill`, `stroke` within
an element, independent of XML attribute order. Group hooks by exact key. A conforming template has
nonempty keys, compatible targets and no duplicate text/image targets or mixed kinds for one key.
Handling violations, including whether unrelated inputs remain available, is implementation policy.

Inputs appear in first-target order. Targets within an input retain discovery order. The separate
[presentation view](metadata.md#ordering-and-single-level-groups) never reorders either structural
collection.

## Binding semantics

Omission preserves authored content. An explicit value replaces every admitted target for its key.
Each bind starts from the independently captured template; previous results cannot affect later
calls. [Substitution](substitution.md) defines conforming requests and successful output.
Implementations own behavior for unknown keys, conflicting assignments and other invalid requests.

Text is literal character data, including the empty string. Replacement preserves comments,
processing instructions and unrelated nodes and never interprets markup. Paint and image references
are raw strings, including empty strings. Encode text and attribute values through XML
serialization; do not validate paint syntax, URI syntax, SVG schemas or resource availability. XML
1.0 forbidden characters cannot be made representable by escaping and are outside the conforming
request contract. Wrong value kinds refer to binding target categories, not the semantic validity of
their strings.

No CSS cascade evaluation or precedence repair occurs. A marked presentation attribute is authored
evidence, not effective paint. Styling may override it. Optional interpretation helpers never gate
inspection or replacement and never rewrite omitted values.

SVG retains geometry, transforms, clipping, paint order and text layout. XML serialization may
change lexical formatting; semantic preservation does not imply byte-identical output. See the
[substitution contract](substitution.md) for output requirements and the implementation-policy
boundary.
