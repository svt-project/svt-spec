# Input presentation metadata

This document defines optional centralized labels, descriptions, ordering and single-level groups.
The existing binding hooks and inline `data-svt-label` remain sufficient for a usable template.

Metadata describes admitted logical inputs. It never creates inputs, changes kinds or authored
defaults, rescues rejected hooks, or imposes binding requirements. Presentation hints are advisory;
hosts may choose their own controls and layout. Descriptions are authored help text, not runtime
diagnostics, validation expressions or binding configuration.

## RDF document metadata

Central metadata is an RDF/XML description of the SVG resource, carried in SVG's `metadata` element.
RDF expresses resource/property/value statements. Here the resource is the document's effective base
URI, the property is `svt:inputs`, and the value is an XML literal containing the input and group
declarations. RDF is part of the interchange contract, independent of any editor's handling of
foreign elements. The XML literal retains declaration structure and order; RDF graph statement order
does not determine presentation order.

This uses the established
[RDF/XML embedding in SVG](https://www.w3.org/TR/rdf-syntax-grammar/#section-rdf-in-SVG) and
[XML literal mechanism](https://www.w3.org/TR/rdf-syntax-grammar/#section-Syntax-XML-literals). SVG
also permits non-RDF metadata; RDF is an SVT representation choice, not a requirement for all SVG
extensions. A general RDF reader sees one XML-valued property; interpreting its inputs still
requires the SVT vocabulary. SVT validates this bounded XML profile, not arbitrary RDF graphs or
semantically equivalent RDF serializations. No RDF library, schema loading or network access is
required.

## Vocabulary and placement

Use the namespace name `https://svt-project.github.io/ns/svt` for SVT metadata elements and
`http://www.w3.org/1999/02/22-rdf-syntax-ns#` for the RDF envelope. Both are exact, case-sensitive
identifiers, not resources to fetch. Prefix spelling is immaterial. Binding hooks remain
unnamespaced `data-svt-*` attributes and the root marker remains `data-svt-version="0"`.

The SVT namespace name is versionless and independent of package and specification revision numbers.
Compare the complete name without normalization: a trailing slash, different case or a different
scheme identifies another namespace. HTTP redirects do not create aliases. A namespace documentation
page is informative; processors must not fetch it to recognize metadata.

Metadata in any other namespace is foreign content, preserved without supplying SVT labels,
descriptions, groups or ordering. Such content does not itself produce an SVT warning or disable
binding hooks; the normal inline-label/key fallback applies. See
[format identity and versioning](versions.md).

Recognize only this direct-child path from the root SVG:

```text
svg / metadata / rdf:RDF / rdf:Description[@rdf:about=""] / svt:inputs[@rdf:parseType="Literal"]
```

`svg` and `metadata` must be in the SVG namespace. The empty, explicitly present `rdf:about`
identifies the document's effective base URI under RDF/XML rules, normally the document itself. An
inherited `xml:base` may identify that resource differently; it is preserved, without URI resolution
or resource access by SVT. SVT selects this exact local XML profile, not other subject spellings
that could resolve to the same URI. Descriptions with absent or nonempty `rdf:about` are opaque:
they describe anonymous or other resources and do not supply template metadata.

Count direct `svt:inputs` properties across all matching descriptions in all root-level SVG
`metadata` elements and their direct `rdf:RDF` children. At most one may occur, even if its literal
marker is invalid. Multiple containers disable central metadata before envelope or field validation.
A single container requires exactly `rdf:parseType="Literal"`; missing, differently cased or other
values produce one `svt.metadata.invalid` warning and discard its contents. No additional
RDF-namespace attributes are supported on that description or property, including alternate
identity, reference and datatype attributes. They invalidate the container rather than changing its
meaning. Check the literal marker first, then the description's RDF attributes, then the property's
RDF attributes; report only the first offending attribute in source order in that stage. Missing
markers point at the property element. No descendant findings are produced for a discarded
container.

Empty containers are valid. Direct SVT children of a matching description other than `svt:inputs`
warn as unknown and their subtrees are ignored. Unrelated RDF properties, foreign subtrees, typed
RDF node elements, nested SVGs and other wrappers are opaque. Direct `svt:inputs` children of SVG
`metadata` have no presentation meaning. SVT does not search descendants for an alternate layout,
merge containers, validate unrelated RDF, or repair metadata. Whitespace, comments and processing
instructions around the envelope do not change selection.

Within a recognized XML-literal property, only these relationships and unnamespaced attributes are
defined:

| Element           | Parent                     | Attributes                                         | Children                      |
| ----------------- | -------------------------- | -------------------------------------------------- | ----------------------------- |
| `svt:inputs`      | Document `rdf:Description` | Required `rdf:parseType="Literal"`                 | `svt:input`, `svt:group`      |
| `svt:input`       | `svt:inputs`               | Required `key`; optional `label`, `order`, `group` | At most one `svt:description` |
| `svt:group`       | `svt:inputs`               | Required `key`; optional `label`, `order`          | At most one `svt:description` |
| `svt:description` | `svt:input` or `svt:group` | None                                               | Plain text                    |

Known names in the wrong position inside the literal are unknown elements, ignored with their
subtrees. This includes nested groups and nested containers. Unnamespaced or foreign-namespaced
elements are opaque rather than alternate spellings. Unknown unnamespaced attributes and attributes
in the SVT namespace warn and are ignored; attributes in other namespaces and namespace declarations
are ignored, except for the envelope's RDF rules above. Recognized input/group attributes must be
unnamespaced. No metadata meaning is assigned to SVT elements outside the placement rules above.

All SVG-namespace `metadata` elements and their entire subtrees, wherever located, are nonbinding
content. Do not discover hooks, inline labels, unknown `data-svt-*` annotations or nested version
markers on them or their descendants. For example, an embedded sample SVG must not become an input.
This exclusion does not exempt content from XML parsing or inspection budgets. Foreign elements
merely named `metadata` do not establish this exclusion. On recognized SVT metadata elements,
unsupported attributes still follow the metadata unknown-attribute rules; they have no binding
meaning.

## Values and resolution

Input keys use the [binding key rules](bindings.md): nonempty after XML attribute normalization,
ordinal comparison, no trimming or case folding. Group keys use the same rules but occupy a separate
identity space; an input and a group may share a key. A nonempty `group` value is an exact reference
to a declared group key. Empty keys invalidate declarations; an empty group reference is an invalid
optional field. Whitespace-only keys remain nonempty exact identities, although they are poor
authoring choices. Declarations may precede or follow their references and artwork targets.

Resolve inputs only after hook admission and structural ambiguity checks. A declaration for an
unknown or rejected key warns and is ignored. Inputs without declarations remain available.

Labels and descriptions trim only leading and trailing XML whitespace (space, tab, CR, LF). Missing,
empty or whitespace-only values are absent. Preserve interior text after normal XML processing,
including line breaks. `svt:description` concatenates text and CDATA, ignores comments and
processing instructions, and must not contain any child elements, even foreign ones. Do not
interpret HTML, Markdown, `xml:space`, SVG `title` or SVG `desc` as input presentation instructions.

The effective input label and its source are:

1. A nonempty valid central label: `Metadata`.
2. A nonempty inline label on the first admitted target: `Element`.
3. The input key: `Key`.

Do not search later targets for an inline label. A central label deliberately overrides all target
labels without warning. Emit the existing `svt.input.labels` warning for differing effective target
labels only when no central label resolves for that input. A description-only declaration does not
suppress that warning. The input description is the valid central description or null. Group labels
resolve to their nonempty label or their key; group descriptions follow the same description rules.
Neither changes identity or raw default evidence.

`order` is an optional integer from 0 through 2,147,483,647 inclusive, represented after XML
normalization by one or more ASCII digits. Leading zeros are allowed. Signs, whitespace, decimals,
exponents, non-ASCII digits and overflow are invalid. Missing order is absent; an invalid order
warns and becomes absent.

## Ordering and single-level groups

Structural `Inputs` and each input's `Targets` keep their existing discovery order. Build a separate
resolved presentation view containing the same input objects:

1. Assign each input to its valid referenced group, or to the unnamed section if no group resolves.
2. Omit declared groups with no admitted members. Empty groups are still validated.
3. Sort named groups by explicit order before absent order, then ascending numeric order, then the
   discovery position of their first member. Use that member's structural position, not its position
   after input sorting. Group declaration order has no effect.
4. Within each group, sort inputs by explicit order before absent order, then ascending numeric
   order, then structural discovery position. Orders are local to the group, not global ranks.
5. Append the unnamed section last, if it has members, with the same input sorting rules. It has no
   key, label, description or order.

Equal order values are valid and produce no warning. Every admitted input appears exactly once; none
may be hidden by metadata. With no metadata, all inputs appear in discovery order in one unnamed
section. With zero admitted inputs, the presentation collection is empty. Authors can use spaced
orders such as 10, 20 and 30 to make insertion easy; spacing is not required.

There is only one level of groups and at most one membership per input. Tabs, columns, nested
groups, widgets, visibility expressions, required fields and validation constraints are outside this
contract.

## Diagnostics and recovery

All metadata semantic findings are warnings. They do not reject artwork inputs or prevent binding.
Malformed XML and exceeded inspection budgets still reject the whole template under the existing
[inspection contract](inspection.md). Binding preserves metadata semantically, including ignored
declarations, alongside unrelated artwork; it does not repair or remove metadata.

Warning messages explain the specific failed rule and what was ignored: for example, the permitted
`order` grammar/range, the prohibition on description child elements, or the single-description
limit. Findings sharing a code must still distinguish those failures for authors. Message wording is
explanatory, not a machine interface; use the existing codes and structured fields for program
logic. Locations, severity, recovery and diagnostic budgets are unchanged by message detail.

| Code                     | Condition                                                                               | Recovery                                                                                                  |
| ------------------------ | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `svt.metadata.container` | More than one eligible `svt:inputs` container                                           | Ignore all central metadata; use inline/key labels and the unnamed section                                |
| `svt.metadata.duplicate` | Repeated input or group key, even with identical declarations                           | Ignore every declaration of that identity, not just later occurrences                                     |
| `svt.metadata.input`     | Input declaration references an unknown or rejected input                               | Ignore the declaration                                                                                    |
| `svt.metadata.group`     | Input references an unknown or discarded group                                          | Ignore membership; retain its other valid fields                                                          |
| `svt.metadata.invalid`   | Invalid RDF envelope, missing/empty identity, invalid optional field or unexpected text | Ignore the container for an invalid envelope, declaration for an invalid identity, or affected field/text |
| `svt.metadata.unknown`   | Unknown SVT element or unknown attribute in the interpreted vocabulary                  | Ignore that attribute or the element's complete subtree                                                   |

Apply these precedence rules to avoid document-order-dependent recovery and cascading diagnostics:

- Multiple containers produce one container warning at the first container with the remaining
  containers as related locations. Do not interpret or diagnose their envelopes or contents.
- For a single container, identify all direct input/group declarations by their keys first. A
  missing/empty key produces one invalid warning and suppresses further diagnostics in that
  declaration. A nonempty key participates in duplicate detection even if its other fields are
  invalid or it references no admitted input.
- Duplicate detection is separate for input keys and group keys. Emit one duplicate warning at the
  first declaration with the others as related locations. Ignore their contents without additional
  field/reference warnings. For a unique unknown/rejected input, emit one input warning and ignore
  its contents before checking optional fields.
- Resolve optional fields independently for remaining declarations. A discarded group remains
  unresolved: each otherwise usable input referencing it receives a group warning. Invalid group
  reference syntax receives only an invalid warning, not an additional unresolved-group warning.
- Multiple description children produce one invalid warning at the first description, with the
  others as related locations; ignore all of those descriptions without inspecting their contents. A
  single description with any child element produces one invalid warning at that description and
  loses the description only. Do not flatten nested markup or produce descendant findings.
- Within `svt:inputs`, `svt:input` and `svt:group`, whitespace, comments and processing instructions
  between child elements are ignored. Other character data produces one invalid warning per parent
  element and is ignored. This restriction does not apply to the enclosing SVG `metadata` element.
  Unknown and foreign subtrees are not recursively interpreted.

Input-scoped findings carry the exact input key when it is available. Container and group findings,
and findings for missing/empty identities, have a null diagnostic key. An input's bad group
reference is input-scoped. Attribute findings point at the attribute name; missing identity and
element/text findings point at the relevant element name. Duplicate/container locations point at
element names. Related locations retain document order. Use the existing one-based UTF-16
coordinates, final source-position/code ordering and diagnostic budget. There is no new severity,
policy switch or budget option.

All metadata markup, text and attributes count toward existing source, XML, depth, element and
attribute budgets. Known hook attributes still count toward `MaxHooks`, including occurrences in
nonbinding metadata. Metadata warnings count toward `MaxDiagnostics`. Resolution must be linear
apart from bounded diagnostic and presentation sorting; do not perform repeated whole-document
searches per declaration. Cancellation also applies during metadata resolution and sorting.

## Authoring example

This template gives one shared paint input a central label and distinguishes fill and stroke inputs
on the same element. Central declaration order does not determine form order:

```xml
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:svt="https://svt-project.github.io/ns/svt"
     xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
     data-svt-version="0" viewBox="0 0 320 120">
  <metadata>
    <rdf:RDF>
      <rdf:Description rdf:about="">
        <svt:inputs rdf:parseType="Literal">
          <svt:group key="appearance" label="Appearance" order="20">
            <svt:description>Colors used throughout the artwork.</svt:description>
          </svt:group>
          <svt:group key="content" label="Content" order="10"/>
          <svt:input key="outline" label="Outline color" group="appearance" order="20"/>
          <svt:input key="heading" label="Main heading" group="content" order="10">
            <svt:description>The heading displayed above the artwork.</svt:description>
          </svt:input>
          <svt:input key="accent" label="Accent color" group="appearance" order="10"/>
        </svt:inputs>
      </rdf:Description>
    </rdf:RDF>
  </metadata>
  <text x="16" y="40" data-svt-text="heading" data-svt-label="Heading">Welcome</text>
  <rect x="16" y="64" width="288" height="32" fill="#336699" stroke="#112233"
        data-svt-fill="accent" data-svt-stroke="outline" data-svt-label="Panel color"/>
  <path d="M16 112 H304" stroke="#336699" data-svt-stroke="accent"/>
</svg>
```

Structural inputs are `heading`, `accent`, `outline`. The presentation view is Content containing
`heading`, then Appearance containing `accent`, `outline`. `accent` has two targets and keeps its
raw common default `#336699`; central labels suppress inline-label disagreements. Removing all
metadata leaves three usable inputs with their original inline/key label rules.

For a tie example, suppose structural inputs are `a`, `b`, `c`, `d`; `a` belongs to group `x`, `b`
and `c` belong to `y`, and `d` is ungrouped. With equal group orders, `x` precedes `y` because `a`
is discovered first. Giving `c` order 0 and leaving `b` unordered puts `c` before `b` inside `y`.
Even if `d` has order 0, it remains in the final unnamed section. Changing declaration order does
not change these results.

## API and acceptance boundary

The [.NET inspection API](../docs/inspection-api.md#presentation-metadata-extension) defines the
immutable resolved model; [CLI discovery JSON](cli.md#discovery-json) exposes equivalent evidence.
No binding lifecycle, assignment shape or default interpretation changes.

Implementation acceptance must cover hook-only and partially annotated templates; shared paint and
multiple hooks per element; label precedence and provenance; description whitespace/CDATA/markup;
duplicate containers, identities and descriptions; exact and rejected references; namespace, RDF
subject/literal and placement boundaries; invalid fields with independent recovery;
equal/absent/extreme orders; empty groups; zero inputs; deterministic ties; and complete, unique
presentation membership. Verify the same input object identities in both API views, explicit JSON
nulls and unchanged structural order.

Exercise budget equality/excess, diagnostic suppression/locations, cancellation and semantic
preservation through binding. Hooks inside metadata must neither become inputs nor affect artwork
ambiguity, but must still count toward the hook budget. Keep malformed XML terminal and raw defaults
unchanged. Use portable fixtures and focused API/CLI tests for these observable behaviors, not tests
that synchronize documentation text with implementation.

Separately verify a representative metadata-bearing template through the repeatable Inkscape
save/reopen checks and Chrome/resvg release rendering checks. Record tool versions and annotation
preservation separately from rendering evidence. Portable conformance does not prove editor
round-trip preservation or renderer equivalence, and native evidence must identify the exact tested
source and tools.
