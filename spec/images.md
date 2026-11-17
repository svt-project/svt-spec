# Image values and resource ownership

SVT supports two supplied image forms. Both are immutable values, independent of image acquisition
or rendering. The [.NET binding API](../docs/binding-api.md) implements these supplied values.

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

Encoded content is an optional formatting convenience, not an image validator. EncodedImage.Create
checks encoded-byte limit, media-type length, then media-type grammar before copying supplied bytes.
A successful image owns its bytes, exposes only MediaType and ByteLength, and can be reused. Failure
returns a diagnostic result; callers must not silently omit a failed image selection. Empty bytes
are allowed. Binding rechecks image limits under its own configuration.

The media type must contain case-insensitive `image/` followed by a nonempty ASCII subtype
containing only letters, digits or `!#$&^_.+-`. Store it in lowercase. Reject whitespace,
parameters, wildcards and entire data URLs. This is the convenience grammar, not a registry lookup
or proof of MIME correctness. No decoding, signature validation or PNG/JPEG admission rule is
introduced.

Format output as `data:<media-type>;base64,<content>` with standard padded base64 and no line
breaks. Percent-encode subtype characters outside ASCII letters, digits, `-`, `.`, `_` and `~` using
uppercase hexadecimal, so accepted characters such as `#` cannot become URI delimiters. Keep the
separating slash literal. MediaType exposes the normalized type, not the URI-escaped spelling. This
follows [data URL syntax](https://www.rfc-editor.org/rfc/rfc2397), which requires media-type tokens
to be URL-escaped where necessary.

More elaborate data URLs remain available through raw reference replacement. These construction
rules do not constrain authored defaults or raw reference strings. See
[substitution](substitution.md) for capture, aggregate replacement and serialized-output budgets.
