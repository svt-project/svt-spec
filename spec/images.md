# Image values and resource ownership

SVT supports two supplied image forms. Both describe values independent of image acquisition or
rendering. Implementations map these forms to their own APIs.

| Form            | Ownership and output                                                                       |
| --------------- | ------------------------------------------------------------------------------------------ |
| Encoded content | Encoded bytes and a declared image media type; binding writes a base64 data URI            |
| URI reference   | Retain the supplied reference without resolving or opening it; binding writes it to `href` |

The portable model is encoded content or reference text, not decoded pixels. Implementations
document capture and ownership of supplied bytes. The host owns decoding, sample preparation, color
conversion and renderer resource lifetimes. SVT never fetches, checks existence or decodes an image.
A declared media type is not evidence that bytes decode or that a renderer supports them.

## References and base locations

Relative and absolute references are supported. Preserve authored reference text after XML attribute
normalization; do not perform path normalization, percent-decoding, case folding or
working-directory lookup on the reference. The eventual consumer resolves relative references
against the SVG element's effective base. The host must retain that context or explicitly prepare
new references when relocating output. Inspection does not require a filesystem location.

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

Encoded content is an optional formatting convenience, not an image validator. A conforming supplied
image has encoded bytes and a media type in the grammar below. Empty bytes are allowed. Resource
limits, capture, diagnostics and validation order are implementation policy. A failed image
preparation must not silently become an omitted binding.

The media type must contain case-insensitive `image/` followed by a nonempty ASCII subtype
containing only letters, digits or `!$&^_.+-`. Store it in lowercase. Whitespace, parameters,
wildcards, percent escapes, fragment delimiters (`#`) and entire data URLs are outside this grammar.
This is the convenience grammar, not a registry lookup or proof of MIME correctness. No decoding,
signature validation or PNG/JPEG admission rule is introduced.

Format output as `data:<media-type>;base64,<content>` with standard padded base64 and no line
breaks. Write the normalized media type literally, preserving admitted punctuation, including the
`+` in `image/svg+xml`. XML attribute escaping is separate: an admitted `&` is serialized as
`&amp;`, preserving its character value when the XML is read. Do not apply a generic URI-component
encoder to the media type or the completed data URL.

The [Fetch data-URL processor](https://fetch.spec.whatwg.org/#data-url-processor) parses the media
type without percent-decoding it. Thus `image/svg%2Bxml` is a different type from `image/svg+xml`.
Reject `#` during encoded-image preparation because a literal hash starts a URL fragment and `%23`
does not preserve the declared type. The captured media type and data-URL header use the same
lowercase type.

More elaborate data URLs remain available through raw reference replacement. These construction
rules do not constrain authored defaults or raw reference strings. See
[substitution](substitution.md) for replacement semantics and implementation policy.

The [optional interpretation contract](interpretation.md#image-reference-interpretation) classifies
one inspected image target at a time. Its bounded data-header reader reports a lowercase literal
declared-type field without percent-decoding header tokens. The reference and payload remain
untouched, and this derived field never validates image bytes, implies MIME sniffing or changes
resource policy.
