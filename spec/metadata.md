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
requires the SVT vocabulary. SVT interprets this bounded XML profile, not arbitrary RDF graphs or
semantically equivalent RDF serializations. No RDF library, schema loading or network access is
required.

## Vocabulary and placement

Use the namespace name `https://svt-project.github.io/ns/svt` for SVT metadata elements and
`http://www.w3.org/1999/02/22-rdf-syntax-ns#` for the RDF envelope. Both are exact, case-sensitive
identifiers, not resources to fetch. Prefix spelling is immaterial. Binding hooks remain
unnamespaced `data-svt-*` attributes and the root marker is `data-svt-version="1.0"`.

The SVT namespace name is versionless and independent of package and specification revision numbers.
Compare the complete name without normalization: a trailing slash, different case or a different
scheme identifies another namespace. HTTP redirects do not create aliases. A namespace documentation
page is informative; processors must not fetch it to recognize metadata.

Metadata in any other namespace is foreign content, preserved without supplying SVT labels,
descriptions, groups or ordering. Such content does not supply SVT presentation values or disable
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

A conforming template has at most one direct `svt:inputs` property across all matching root-level
descriptions. When present it has exactly `rdf:parseType="Literal"`. The selected description and
property have no additional RDF-namespace attributes; alternate identity, reference and datatype
attributes are outside this profile. Missing markers, conflicting containers and invalid envelope
attributes are nonconforming metadata; diagnostics and recovery are implementation policy.

Empty containers are valid. Direct SVT children of a matching description other than `svt:inputs`
have no SVT meaning and their subtrees are ignored. Unrelated RDF properties, foreign subtrees,
typed RDF node elements, nested SVGs and other wrappers are opaque. Direct `svt:inputs` children of
SVG `metadata` have no presentation meaning. SVT does not search descendants for an alternate
layout, merge containers, validate unrelated RDF, or repair metadata. Whitespace, comments and
processing instructions around the envelope do not change selection.

Within a recognized XML-literal property, only these relationships and unnamespaced attributes are
defined:

| Element           | Parent                     | Attributes                                         | Children                      |
| ----------------- | -------------------------- | -------------------------------------------------- | ----------------------------- |
| `svt:inputs`      | Document `rdf:Description` | Required `rdf:parseType="Literal"`                 | `svt:input`, `svt:group`      |
| `svt:input`       | `svt:inputs`               | Required `key`; optional `label`, `order`, `group` | At most one `svt:description` |
| `svt:group`       | `svt:inputs`               | Required `key`; optional `label`, `order`          | At most one `svt:description` |
| `svt:description` | `svt:input` or `svt:group` | None                                               | Plain text                    |

Known names in the wrong position inside the literal have no meaning and are ignored with their
subtrees. This includes nested groups and nested containers. Unnamespaced or foreign-namespaced
elements are opaque rather than alternate spellings. Unknown unnamespaced attributes and attributes
in the SVT namespace are ignored; attributes in other namespaces and namespace declarations are
ignored, except for the envelope's RDF rules above. Recognized input/group attributes must be
unnamespaced. No metadata meaning is assigned to SVT elements outside the placement rules above.

All SVG-namespace `metadata` elements and their entire subtrees, wherever located, are nonbinding
content. Do not discover hooks, inline labels, unknown `data-svt-*` annotations or nested version
markers on them or their descendants. For example, an embedded sample SVG must not become an input.
This exclusion does not change XML processing or implementation resource policy. Foreign elements
merely named `metadata` do not establish this exclusion. On recognized SVT metadata elements,
unsupported attributes still have no SVT interpretation; they have no binding meaning.

## Values and resolution

Input keys use the [binding key rules](bindings.md): nonempty after XML attribute normalization,
ordinal comparison, no trimming or case folding. Group keys use the same rules but occupy a separate
identity space; an input and a group may share a key. A nonempty `group` value is an exact reference
to a declared group key. Empty keys and empty group references are nonconforming. Whitespace-only
keys remain nonempty exact identities, although they are poor authoring choices. Declarations may
precede or follow their references and artwork targets.

In conforming metadata, input declarations refer to discovered inputs; input keys and group keys are
each unique within their own identity space. Each group reference names a declared group. Inputs
without declarations remain available. Violations follow implementation policy, not a portable
field-by-field recovery algorithm.

Labels and descriptions trim only leading and trailing XML whitespace (space, tab, CR, LF). Missing,
empty or whitespace-only values are absent. Preserve interior text after normal XML processing,
including line breaks. `svt:description` concatenates text and CDATA, ignores comments and
processing instructions, and must not contain any child elements, even foreign ones. Do not
interpret HTML, Markdown, `xml:space`, SVG `title` or SVG `desc` as input presentation instructions.

The effective input label and its source are:

1. A nonempty valid central label: `Metadata`.
2. A nonempty inline label on the first admitted target: `Element`.
3. The input key: `Key`.

Do not search later targets for an inline label. A central label overrides all target labels. A
description-only declaration does not change label selection. Diagnostics for differing inline
labels are implementation policy. The input description is the valid central description or null.
Group labels resolve to their nonempty label or their key; group descriptions follow the same
description rules. Neither changes identity or raw default evidence.

`order` is an optional integer from 0 through 2,147,483,647 inclusive, represented after XML
normalization by one or more ASCII digits. Leading zeros are allowed. Signs, whitespace, decimals,
exponents, non-ASCII digits and overflow are invalid. Missing order is absent; an invalid order is
nonconforming metadata.

## Ordering and single-level groups

Structural `Inputs` and each input's `Targets` keep their existing discovery order. Build a separate
resolved presentation view containing the same input objects:

1. Assign each input to its valid referenced group, or to the unnamed section if no group is
   specified.
2. Omit declared groups with no admitted members. Empty groups follow the same authoring rules.
3. Sort named groups by explicit order before absent order, then ascending numeric order, then the
   discovery position of their first member. Use that member's structural position, not its position
   after input sorting. Group declaration order has no effect.
4. Within each group, sort inputs by explicit order before absent order, then ascending numeric
   order, then structural discovery position. Orders are local to the group, not global ranks.
5. Append the unnamed section last, if it has members, with the same input sorting rules. It has no
   key, label, description or order.

Equal order values are valid. Every admitted input appears exactly once; none may be hidden by
metadata. With no metadata, all inputs appear in discovery order in one unnamed section. With zero
admitted inputs, the presentation collection is empty. Authors can use spaced orders such as 10, 20
and 30 to make insertion easy; spacing is not required.

There is only one level of groups and at most one membership per input. Tabs, columns, nested
groups, widgets, visibility expressions, required fields and validation constraints are outside this
contract.

## Implementation policy

Conforming metadata follows the envelope, field and reference rules above. Nonconforming metadata
may cause rejection or documented recovery. The specification does not require field-by-field
salvage, duplicate-group suppression, cascading-warning control, exact diagnostics or source
locations. Optional authoring validation belongs to implementations.

Foreign content and explicitly ignored elements/attributes retain their defined opaque behavior;
they are not malformed metadata. Within recognized inputs, input and group elements, character data
between child elements must be XML whitespace. Descriptions follow their separate text rules.
Comments and processing instructions are allowed and do not supply presentation values.

Metadata never creates binding inputs or changes artwork defaults. Binding preserves metadata
alongside unrelated artwork. It does not repair, remove or rewrite metadata as a side effect.
Implementations own resource controls for all content, including metadata, under the
[processing policy boundary](inspection.md#diagnostics-and-operational-controls).

## Authoring example

This template gives one shared paint input a central label and distinguishes fill and stroke inputs
on the same element. Central declaration order does not determine form order:

```xml
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:svt="https://svt-project.github.io/ns/svt"
     xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
     data-svt-version="1.0" viewBox="0 0 320 120">
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

## Conformance and acceptance boundary

Metadata resolution exposes presentation independently of structural discovery. No binding
lifecycle, assignment shape or default interpretation changes.

Portable acceptance covers hook-only and partially annotated templates; shared paint and multiple
hooks per element; label precedence and provenance; description whitespace and CDATA; conforming
namespace aliases, RDF envelopes and placement; equal/absent/extreme orders; empty groups; zero
inputs; deterministic ties; and complete, unique presentation membership. Verify unchanged
structural order and semantic preservation through binding. Hooks inside SVG metadata never become
artwork inputs, including in embedded examples.

Duplicate/invalid declarations, field recovery, diagnostics, source positions, resource limits and
cancellation belong to implementation tests. These tests may be valuable without defining another
implementation's behavior on nonconforming metadata.

For a supported editor/rendering workflow, separately verify representative metadata-bearing
templates through save/reopen and rendering checks. Record tool versions and annotation preservation
separately from rendering evidence. These observations are informative: portable conformance does
not prove editor round-trip preservation or renderer equivalence. Native evidence identifies the
exact tested source and tools.
