# Optional authored-value interpretation

Interpretation is an explicit, per-target operation after inspection. It helps hosts initialize
editor controls from supplied authored defaults. It does not establish rendered appearance, certify
SVG/CSS/URI validity, or participate in inspection or binding admission.

The lifecycle is inspect, optionally interpret individual targets, present host controls, and bind
only explicit edits. Retain the original target, its XML-processed raw string, source attribute and
location on every outcome. Never rewrite raw evidence, synthesize missing defaults, fetch resources,
or infer an edit from opening and accepting a control. The [raw default contract](defaults.md)
continues to own Common/Mixed/Absent summaries.

Interpretation has no input-level aggregate, color-equivalence policy, normalization serializer or
automatic binding conversion. Hosts may traverse targets in structural order and choose their own
comparison policy. Text requires no interpretation operation.

## Paint outcomes

| Kind                      | Meaning                                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| Absent                    | The marked attribute is absent; no implicit SVG default is supplied.                           |
| Literal                   | A supported self-contained color; expose normalized sRGB and alpha.                            |
| NoPaint                   | The complete value is `none`; distinct from transparent color.                                 |
| RequiresContext           | A recognized context keyword or variable dependency; no color is supplied.                     |
| ResourceReference         | A supported `url(...)` paint expression; its fallback is not an effective default.             |
| UnsupportedOrUnrecognized | Outside this bounded grammar, malformed, numerically unrepresentable, or over a parsing limit. |

Only Literal has a color. Only limit exhaustion has an ExceededLimit value. Empty and
whitespace-only present paint strings are UnsupportedOrUnrecognized, not Absent or NoPaint. There
are no interpretation diagnostics, warnings, severity policies or template errors. A host may
explain the outcome using its kind, exceeded limit and retained source evidence.

## Literal grammar

This profile selects familiar CSS forms and freezes its own boundaries. It does not automatically
expand when CSS changes. Named colors use the keyword/value table in
[CSS Color 4, November 18, 2026](https://www.w3.org/TR/2026/CRD-css-color-4-20261118/#named-colors),
including aliases and rebeccapurple. Names, function names and units use ASCII case-insensitive
matching; identifiers are never culture-folded.

| Form      | Admitted subset                                                                                      |
| --------- | ---------------------------------------------------------------------------------------------------- |
| Hex       | Exactly 3, 4, 6 or 8 hexadecimal digits after `#`; alpha is last. Short digits expand by repetition. |
| Named     | The fixed named-color table, plus `transparent` as RGBA (0, 0, 0, 0).                                |
| RGB comma | `rgb(R,G,B[,A])` or `rgba(R,G,B[,A])`; three numbers or three percentages.                           |
| RGB space | `rgb(R G B [/ A])` or `rgba(R G B [/ A])`; each channel independently a number or percentage.        |
| HSL comma | `hsl(H,S%,L%[,A])` or `hsla(H,S%,L%[,A])`.                                                           |
| HSL space | `hsl(H S% L% [/ A])` or `hsla(H S% L% [/ A])`.                                                       |

Square brackets in this table denote optional syntax. Hue is a number of degrees or a number
immediately followed by deg, grad, rad or turn. Alpha is a number or percentage and defaults to 1.
HSL saturation/lightness require percentages even where broader CSS accepts other forms.

For paint, whitespace means space, tab, CR, LF or form feed. Ignore it only at the outer boundary
and at grammar separators. Space forms require whitespace between the first three components; commas
and slash may have surrounding whitespace. Function names must touch their opening parenthesis;
units and percent signs must touch their numbers. Consume the entire trimmed value. Mixed
comma/space separators, wrong arity and trailing tokens are unsupported.

Numeric syntax, using ASCII digits, is:

```text
[+-]? ( [0-9]+ ( "." [0-9]+ )? | "." [0-9]+ ) ( [eE] [+-]? [0-9]+ )?
```

This is a whole-token grammar, based on
[CSS number tokenization](https://www.w3.org/TR/css-syntax-3/#consume-number); it does not inherit
platform numeric parser extensions. It admits `+.5` and `1e2`, but not `1.`, NaN, Infinity,
thousands separators or non-ASCII digits. Count the sign, decimal point, exponent and exponent
sign/digits toward the numeric-token limit; exclude a trailing percent sign or hue unit.

### Numeric meaning and precision

Interpret components as finite IEEE 754 binary64 numbers using invariant conversion. Finite
subnormal values and underflow to zero are permitted; numeric overflow to infinity is
UnsupportedOrUnrecognized before clamping, without ExceededLimit. Limits describe work budgets, not
numeric representability.

Clamp RGB numbers to `[0,255]` and percentages to `[0,100]`, then normalize to `[0,1]`. Clamp alpha
numbers to `[0,1]` and percentages to `[0,100]`. Clamp HSL saturation/lightness to `[0,100]`. Wrap
hue by one revolution, reducing in its supplied unit before degree conversion to avoid overflow.
Evaluate the usual HSL-to-sRGB component calculation after those steps; HSL hue has no effect when
saturation is zero. These follow the bounded RGB/HSL model described in
[CSS Color 3](https://www.w3.org/TR/css-color-3/#hsl-color).

Return finite R, G, B and A doubles in `[0,1]`. RGB components are encoded sRGB, not linear-light
components; alpha is unpremultiplied. Normalize signed zero to positive zero and clamp any tiny
floating-point overshoot at the final boundary. Use binary64 arithmetic without intermediate 8-bit
quantization. Conformance compares calculated components with absolute tolerance 1e-12; this is a
test tolerance, not a public approximate-equality operation.

Do not combine a literal's alpha with fill-opacity, stroke-opacity, opacity or ancestor state.
Preserve RGB components even when alpha is zero. For example, transparent black and transparent red
both have zero alpha but retain different RGB components.

CSS escapes and comments, missing components such as `rgb(none 0 0)`, relative colors, arithmetic
evaluation, HWB, Lab/LCH/OKLab/OKLCH, color(), color-mix() and wider-gamut conversion are outside
the literal subset. A recognized variable dependency may still produce RequiresContext under the
next section; otherwise these forms are UnsupportedOrUnrecognized.

## Context and resource recognition

Recognize these complete keywords as RequiresContext: currentColor, inherit, initial, unset, revert,
revert-layer, context-fill and context-stroke, plus the system-color keywords in sections 6.2 and
Appendix A of the same
[fixed CSS Color 4 edition](https://www.w3.org/TR/2026/CRD-css-color-4-20261118/#css-system-colors).
Even a keyword whose result might be inferred in some environments is not evaluated here.

Context recognition is deliberately lexical. It does not validate or evaluate the surrounding CSS
expression. Admit a complete, balanced function expression containing a recognized `var(...)` call,
either at the root or nested in another function, as RequiresContext. The outer function must
consume the entire trimmed value. Function identifiers use the ASCII subset
`[-_A-Za-z][-_A-Za-z0-9]*` and must immediately precede `(`. Token boundaries matter: `notvar(...)`,
quoted `"var(--x)"`, and URL text do not identify a variable dependency. Numeric tokens with
attached identifier units are consumed together, so `1var(` is not var().

A recognized var() has an ASCII custom-property name matching `--[-_A-Za-z0-9]+`, with optional
whitespace before and after that name, then its closing parenthesis or a comma introducing a
fallback. Fallbacks may be empty or contain balanced nested functions; they are not evaluated. Every
encountered var() outside strings and URL bodies must satisfy this rule. This is a bounded subset of
[CSS variables](https://www.w3.org/TR/css-variables-1/#using-variables); escaped and non-ASCII
custom-property names remain unsupported.

The context scan accepts ASCII printable characters and paint whitespace, but rejects comments,
backslashes, braces, square brackets and semicolons outside strings/URL bodies. Single- and
double-quoted strings must close, have no backslashes or raw CR/LF/form feed, and are opaque to
function and numeric recognition. Parentheses inside strings are not nesting. Unmatched delimiters
or malformed var() calls yield UnsupportedOrUnrecognized, even if another var() is recognized. Every
opening parenthesis outside strings/URL bodies must start a function token; bare grouping
parentheses are unsupported and cannot bypass the nesting limit. This admits `rgb(var(--red) 0 0)`
and `var(--paint, var(--fallback, red))` without promising that arbitrary enclosing function syntax
is valid CSS. A complete `calc(1 + 2)` has no recognized dependency and remains unsupported.

A resource expression is one complete `url(...)`, optionally followed by whitespace and one
fallback: none, a supported literal, currentColor, or a complete context expression recognized
above. Quoted URL bodies permit either quote style; unquoted bodies must not contain quotes,
parentheses or whitespace. Allow surrounding paint whitespace inside url(). After unquoting, the
nonempty reference must pass the ordinary reference character scan below, without imposing image
length limits. Escaped URLs are outside this profile. URL bodies are opaque to variable and numeric
recognition. A supported URL expression takes ResourceReference precedence over its fallback's kind;
no fallback becomes the effective color and no URL string is extracted or resolved. This preserves
the distinction in [SVG paint syntax](https://www.w3.org/TR/SVG2/painting.html#SpecifyingPaint).

For example, `url(#gradient) red` and `url("#gradient") var(--fallback)` are ResourceReference.
`url("var(--x)")` is a reference, not a variable dependency. An empty URL, malformed URL wrapper,
unsupported fallback or trailing extra expression is UnsupportedOrUnrecognized.

## Image reference interpretation

Image outcomes are Absent, Empty, FragmentReference, RelativeReference, AbsoluteReference, DataUri
and UnsupportedOrUnrecognized. Preserve the complete raw reference and Href/XLinkHref origin via the
target. Empty means exactly a present zero-length string. Do not trim image references;
whitespace-only and surrounding-whitespace strings are unsupported.

Ordinary classification is lexical, not URI validation. Within MaxReferenceCharacters, permit ASCII
letters/digits, `-._~:/?#[]@!$&'()*+,;=`, and percent escapes consisting of `%` and two hexadecimal
digits. All other characters, including raw whitespace, backslashes and non-ASCII characters, are
unsupported. Do not percent-decode ordinary references, normalize paths, use a platform URI/path
parser, infer files from drive letters, or validate hosts, ports or scheme rules. The categories use
the scheme/relative distinction of
[RFC 3986](https://www.rfc-editor.org/rfc/rfc3986.html#section-4.1):

1. A leading `#` is FragmentReference, including `#` alone.
2. A leading `[A-Za-z][A-Za-z0-9+.-]*:` is AbsoluteReference, including unfamiliar schemes.
3. Otherwise a colon before the first slash, question mark or hash is unsupported.
4. Remaining admitted strings are RelativeReference, including `//host/path`, `/path`, `?query` and
   relative paths with fragments.

These names identify text shapes, not resource existence, usability or safety. For example,
`https://` still has the AbsoluteReference shape. The host owns any stricter URI and resource
policy; interpretation never prevents binding the raw string.

### Data-URI headers

An ASCII case-insensitive `data:` prefix at character zero selects the data-header path before
ordinary-reference length or character checks. Search only the bounded header for its first literal
comma. MaxDataUriHeaderCharacters counts from the initial `d` through that comma, inclusive. Never
scan, trim, validate, copy, percent-decode or base64-decode the payload. A multi-megabyte payload
with a short header costs the same parsing work as an empty payload.

Recognize `data:[type/subtype][;name=value...][;base64],`. The optional bare base64 marker is
case-insensitive, occurs at most once, and is last. An item named `base64=value` is a parameter, not
that marker. Empty header/type is permitted, including `data:,` and `data:;charset=UTF-8,`. Do not
supply an implicit media type: DeclaredMediaType records only an explicit declaration, even though
data-URI processing has defaults under [RFC 2397](https://www.rfc-editor.org/rfc/rfc2397.html).

For this profile, type, subtype and parameter names are nonempty ASCII tokens containing letters,
digits or `!$%&^_.+-`. Require the type/subtype separating slash literally in the header. Parse
tokens literally, without percent-decoding, following the
[Fetch data-URL processor](https://fetch.spec.whatwg.org/#data-url-processor). Percent is a MIME
token character, not an escape introducer here; even `%` or `%ZZ` remains literal token text. For
example, `image/svg%2Bxml` yields `image/svg%2bxml`, not `image/svg+xml`. An escaped slash does not
replace the required separator. Reject a literal hash before the header's comma because it starts a
fragment, not header or payload content. A caret remains literal.

Expose only the explicit type/subtype as a lowercase DeclaredMediaType, without parameters. This is
a bounded header profile, not a complete URL or MIME parser. It does not decode or rewrite the
reference or payload. Encoded-image creation admits a narrower alphabet for newly generated URLs;
interpretation must not make an authored percent-bearing type appear to be another type.

Parameter values are nonempty opaque sequences using the ordinary reference character alphabet,
excluding literal hash, semicolon and comma; percent escapes must be complete. Raw quotes and
whitespace are unsupported. Repeated parameter names are allowed because no parameter semantics are
interpreted. Unknown bare items, missing names/values, duplicate or nonfinal base64 markers, invalid
escapes and malformed type/subtype make the whole result UnsupportedOrUnrecognized with no
DeclaredMediaType. Non-image media types are permitted; the declaration proves nothing about payload
bytes or renderability.

DataUri means this header profile was recognized, not that a complete URL or encoded image was
validated. The payload is opaque even when empty, malformed base64 or otherwise unusable.

## Budgets and precedence

All options are positive integers, measured in UTF-16 code units except nesting depth. The following
profile supplies conformance-reference settings. Hosts may configure different positive limits;
fixture runners select this profile unless a case overrides it. Counting units and failure
precedence are portable and do not depend on programming-language property names.

| Option                     | Default | ExceededLimit           |
| -------------------------- | ------: | ----------------------- |
| MaxPaintCharacters         |    4096 | PaintCharacters         |
| MaxReferenceCharacters     |    4096 | ReferenceCharacters     |
| MaxDataUriHeaderCharacters |    1024 | DataUriHeaderCharacters |
| MaxNumericTokenCharacters  |      64 | NumericTokenCharacters  |
| MaxNestingDepth            |      16 | NestingDepth            |

Equality passes; the first unit beyond a budget fails that interpretation with
UnsupportedOrUnrecognized and the corresponding ExceededLimit. No partially parsed color or media
type is returned. Unsupported syntax and numeric overflow have null ExceededLimit. No new
inspection/binding limit or diagnostic code is introduced.

After API argument/configuration validation, apply these rules:

1. An absent target returns Absent without scanning a value.
2. Paint checks the complete raw length before trimming or allocating derived strings. Scan
   left-to-right for the supported lexical structure, numeric-token lengths and nesting before
   semantic classification. Stop at the first lexical rejection or exceeded scan limit; later
   findings do not replace it. Numeric-token checks cover tokens outside strings and URL bodies,
   including opaque var() fallbacks. Nesting counts simultaneously open function parentheses; the
   outermost function is depth 1, including url(), and quoted parentheses do not count. Identifier
   and hash-token contents are not numeric tokens: digits inside custom-property names or
   hexadecimal colors do not consume MaxNumericTokenCharacters.
3. After a successful paint scan, classify the complete keyword, resource expression, contextual
   function expression or supported literal under the rules above; otherwise return unsupported.
4. Images distinguish Empty, then data-prefix selection, then ordinary references. For ordinary
   references check the complete raw length before any character scan.
5. For data URIs find the comma within the header budget before interpreting header fields. If no
   comma occurs and the entire string fits the budget, return unsupported without a limit. If the
   string extends beyond the budget with no comma inside it, report DataUriHeaderCharacters without
   scanning farther, even if the unseen suffix contains no comma. Header grammar is checked only
   after a bounded comma is found.

Numeric and nesting budgets apply only to paint. Reference length applies only to ordinary image
references. Data headers use their own limit; payload length is not an interpretation budget.
Inspection still owns source and XML budgets before any target exists.

Use bounded linear scans with no recursive evaluation or backtracking regexes. Extra parsing storage
is bounded by options; retaining the already immutable target/raw string is not a new copy. No
allocation-free guarantee is made. Cancellation applies before work, throughout scans and before
return, including unsupported/limit results. No operation performs I/O, resource callbacks, CSS
cascade evaluation, image decoding, MIME sniffing, dimension discovery or rendering.

## Acceptance boundary

Use focused behavioral tests and language-neutral examples for:

- Every admitted literal family, aliases, whitespace, separators, full consumption and
  culture-independent numeric parsing; named-color table values and exclusions.
- Fractional RGB/alpha, all hex lengths, transparent versus none, clamping, hue units/wrapping,
  achromatic HSL, numeric overflow/underflow and no byte quantization.
- Context keywords, nested/empty variable fallbacks, token boundaries and false positives inside
  identifiers, strings or URLs; supported resource fallbacks and no fallback promotion.
- Unsupported escapes/comments, missing components, wider-gamut/relative/math syntax, malformed
  wrappers, non-ASCII tokens and unsupported trailing syntax.
- Every image category; empty versus absent; no trimming; scheme/relative edge cases; data-header
  parameters/escapes and constructor-produced subtypes; omitted/invalid declarations; long and
  deliberately invalid payloads remaining unexamined.
- Equality/excess for each budget, deterministic precedence, malformed-but-oversized input,
  cancellation and reuse of options across calls.
- Exact target identity, raw/origin/location preservation, nullable result invariants, original
  target order when hosts iterate, and no aggregate or inferred edit.
- Discovery and binding remaining usable independently of interpretation, including unsupported
  strings and limit results; no implicit interpretation.

Consumer interaction acceptance must distinguish authored evidence, interpreted presentation and
initial chooser state. Initialization notifications, no-edit acceptance, cancel and a change back to
the session's initial chooser value preserve existing binding intent. A genuine accepted change
creates an explicit replacement; Reset removes it. Widget quantization is display-only until such an
edit, alpha must not be silently discarded, and raw Mixed stays Mixed even when swatches match. A
paint-server fallback is never an effective chooser default. A host owns its chooser policy and
editing lifecycle; interpretation adds no editor state, binding service or aggregate result to the
core. Native rendering is not an oracle for authored-value interpretation and cannot establish
effective appearance from direct attributes.
