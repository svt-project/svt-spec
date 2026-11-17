# Image values and resource ownership

SVT supports two supplied image forms. Both are immutable values, independent of image acquisition
or rendering. This contract defines behavior; exact binding API signatures belong to a later slice.

| Form            | Ownership and output                                                                        |
| --------------- | ------------------------------------------------------------------------------------------- |
| Encoded content | Capture independent bytes and a declared image media type; binding writes a base64 data URI |
| URI reference   | Retain the supplied reference without resolving or opening it; binding writes it to `href`  |

Neither form contains a pixel buffer, stream, decoder, native handle or callback. Changing a
caller's original encoded buffer cannot change a captured value. The host owns decoding, sample
preparation, color conversion and renderer resource lifetimes. SVT never fetches, checks existence
or decodes an image. A declared media type is not evidence that bytes decode or that a renderer
supports them.

## References and base locations

Relative and absolute references are supported. Preserve authored reference text after XML attribute
normalization; do not perform path normalization, percent-decoding, case folding or
working-directory lookup. The eventual consumer resolves relative references against the SVG
element's effective base. The host must retain that context or explicitly prepare new references
when relocating output. Inspection accepts source bytes without requiring a filesystem location.

For default evidence, use unnamespaced `href` when present, including when empty; otherwise use
`href` in `http://www.w3.org/1999/xlink`. Record which attribute supplied the evidence. This follows
[SVG reference precedence](https://www.w3.org/TR/SVG/linking.html). An empty attribute is Present
evidence with an empty raw string. Reading a reference never establishes that it resolves.

An image replacement writes unnamespaced `href`. If an XLink `href` already exists on that target,
write the same replacement there too, preventing contradictory references for different SVG
consumers. Do not add an XLink attribute when absent. Omission preserves both authored attributes.
This handles SVG syntax, not a retired SVT representation.

Supplied references are raw XML-representable strings, including empty strings. Do not reject
malformed URI syntax, unfamiliar schemes or missing resources. XML encoding protects document
structure; it does not sanitize resource behavior or establish rendering safety. Consumers own any
resource-access policy at their execution boundary.

## Encoded-content convenience

Encoded content is an optional formatting convenience, not an image validator. Capture supplied
bytes and the declared media type and construct a data URI without decoding, checking signatures or
certifying MIME correctness. Exact constructors, data-URI formatting constraints and replacement
size budgets belong to the substitution API design. They do not restrict authored defaults or raw
reference replacement. There is no core portable-image profile or PNG/JPEG admission rule.
