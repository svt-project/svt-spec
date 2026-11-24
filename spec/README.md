# SVT specification

This contract describes a structurally discoverable SVG document with named text, image and paint
inputs. Ordinary SVG values remain the authored preview. Templates retain `.svg` filenames.

SVG owns geometry, clipping, transforms, paint order, fonts and layout. Expressions, loops,
conditional elements, arbitrary attribute mutation, automatic text fitting and CSS precedence repair
are outside this contract.

## Binding keys and display labels

A binding annotation names an input that a caller can replace. Its value is the **key**, the stable
identity used to address that input. The optional `data-svt-label` gives it a human-readable name
for an editor or form; changing the label does not change the key.

For example, this template exposes a text input with key `heading` and display label `Main heading`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" data-svt-version="1.0" viewBox="0 0 320 80">
  <text x="16" y="48" data-svt-text="heading" data-svt-label="Main heading">Welcome</text>
</svg>
```

Inspection reports `Welcome` as the authored default. A binding call addresses `heading`, not
`Main heading`. Omitting that input when binding preserves the original text. Inspection itself
never changes the SVG; binding produces an independent SVG document.

The same key-and-label pairing applies to images and paints. These elements could appear inside a
root carrying `data-svt-version="1.0"`:

```xml
<image x="16" y="16" width="64" height="64" href="portrait.svg"
       data-svt-image="portrait" data-svt-label="Portrait image"/>
<rect x="96" y="16" width="64" height="64" fill="#336699"
      data-svt-fill="accent" data-svt-label="Accent color"/>
<path d="M176 48 H240" stroke="#336699"
      data-svt-stroke="accent" data-svt-label="Accent color"/>
```

Here `portrait` is one image input. `accent` is one shared paint input with two targets: the
rectangle's fill and the path's stroke. Their matching authored strings produce a common default of
`#336699`. Inspection preserves `portrait.svg` as a reference without opening it.

- Use `data-svt-text` for text, `data-svt-image` for an image reference, and `data-svt-fill` or
  `data-svt-stroke` for paint.
- Without a nonempty central or inline label, the key is also the display label. Labels trim XML
  whitespace; keys remain exact and case-sensitive.
- An inline label applies to every hook on its element. Without a central override, the first target
  supplies a shared paint input's label. Diagnostics for differing labels are implementation policy.
- Text and image inputs each have one target. Paint inputs may share a key across fill and stroke
  targets. Reusing a key across different input kinds is an error.

## Optional presentation metadata

Optional [metadata](metadata.md) adds central labels, descriptions, ordering and one level of
groups. Inline labels remain useful; central labels deliberately override them for a logical input.
The RDF/XML envelope describes the SVG document; `svt:inputs` carries its presentation metadata as
an XML literal. For example, add this direct child of the SVG root to polish the `heading` input
above:

```xml
<metadata xmlns="http://www.w3.org/2000/svg"
          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
          xmlns:svt="https://svt-project.github.io/ns/svt">
  <rdf:RDF>
    <rdf:Description rdf:about="">
      <svt:inputs rdf:parseType="Literal">
        <svt:group key="content" label="Content" order="10"/>
        <svt:input key="heading" label="Headline" group="content" order="10">
          <svt:description>A short heading displayed above the artwork.</svt:description>
        </svt:input>
      </svt:inputs>
    </rdf:Description>
  </rdf:RDF>
</metadata>
```

The key is still `heading`; its display label becomes `Headline`. Its authored default is still
`Welcome`. Metadata creates no new input and does not require that input to be bound. The
[complete example](metadata.md#authoring-example) covers shared paints and distinct labels for
multiple inputs on one element. Group/input order guides automatic forms while structural discovery
order remains available. SVG artwork remains the sole source of authored defaults.

The [conformance references](../conformance/README.md) supply small inputs and expected results.
Authoring tools and renderers require separate validation for their supported workflows.

## Contract boundaries

The portable contracts define observable behavior without requiring the .NET library or CLI:

| Area                    | Contract                                                                     |
| ----------------------- | ---------------------------------------------------------------------------- |
| Template format         | SVG admission, hooks, exact keys, raw defaults, metadata and format identity |
| Processing              | Successful discovery, defaults, presentation, substitution and preservation  |
| Implementation policy   | XML error reporting, diagnostics, recovery, operational limits and API shape |
| Optional interpretation | Authored-value grammar and results, independent of binding admission         |
| Conformance data        | Portable observations of conforming inputs, with a separate fixture envelope |

SVT builds on ordinary XML processing. It does not prescribe a DOM or streaming parser, require
independent XML validation, or standardize malformed-input recovery. See the
[processing boundary](inspection.md). Implementations document diagnostics, optional source
locations, operational controls, ownership and cancellation. CLI transport, filesystem publication,
package compatibility and release policy also belong to implementations.

Authoring recipes and named renderer observations are informative. SVG owns layout and appearance;
successful SVT conformance does not certify font availability, resource loading or identical pixels.

## Detailed contracts

The contracts are specified in these focused references:

- [Bindings and syntax](bindings.md)
- [Format identity and versioning](versions.md)
- [Input presentation metadata](metadata.md)
- [Image values and resource ownership](images.md)
- [Authored defaults](defaults.md)
- [Optional per-target interpretation](interpretation.md)
- [Inspection and implementation policy](inspection.md)
- [Substitution and output preservation](substitution.md)

Implementation API, CLI, package and release policy belong to each implementation. The
[.NET implementation](https://github.com/svt-project/svt-dotnet) supplies one such mapping.

The root marker is `data-svt-version="1.0"`; see [format identity](versions.md). The specification
and canonical reference assets are versioned together as SemVer editions; the template marker
selects the edition's major/minor format, independently of editorial patch revisions.
[Contribution guidance](../CONTRIBUTING.md) describes changes and reference-asset publication.
