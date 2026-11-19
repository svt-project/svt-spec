# SVT specification

The initial contract describes a structurally discoverable SVG document with named text, image and
paint inputs. Ordinary SVG values remain the authored preview. Templates retain `.svg` filenames.

SVG owns geometry, clipping, transforms, paint order, fonts and layout. Expressions, loops,
conditional elements, arbitrary attribute mutation, automatic text fitting and CSS precedence repair
are outside the initial scope.

## Binding keys and display labels

A binding annotation names an input that a caller can replace. Its value is the **key**, the stable
identity used to address that input. The optional `data-svt-label` gives it a human-readable name
for an editor or form; changing the label does not change the key.

For example, this template exposes a text input with key `heading` and display label `Main heading`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" data-svt-version="0" viewBox="0 0 320 80">
  <text x="16" y="48" data-svt-text="heading" data-svt-label="Main heading">Welcome</text>
</svg>
```

Inspection reports `Welcome` as the authored default. A binding call addresses `heading`, not
`Main heading`. Omitting that input when binding preserves the original text. Inspection itself
never changes the SVG; binding produces an independent SVG document.

The same key-and-label pairing applies to images and paints. These elements could appear inside a
root carrying `data-svt-version="0"`:

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
  supplies a shared paint input's label; differing labels produce a warning.
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
          xmlns:svt="https://bathos-labs.github.io/svt">
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

See the [authoring guide](../docs/authoring.md) and
[original examples](../examples/authoring/README.md) for save/reopen and rendering checks.

## Detailed contracts

The contracts are specified in these focused references:

- [Bindings and syntax](bindings.md)
- [Input presentation metadata](metadata.md)
- [Image values and resource ownership](images.md)
- [Authored defaults](defaults.md)
- [Optional per-target interpretation](interpretation.md)
- [.NET interpretation API](../docs/interpretation-api.md)
- [Inspection diagnostics and limits](inspection.md)
- [Substitution policies, diagnostics and limits](substitution.md)
- [.NET binding API](../docs/binding-api.md)
- [Command-line interface](cli.md)

Structural inspection and substitution are implemented. Discovery preserves raw authored values; it
does not certify SVG validity or rendering. Optional per-target interpretation has an agreed
contract and awaits implementation. It preserves raw evidence and defers aggregation to hosts. The
[.NET caller-buffer export](../docs/binding-api.md#output-export) supports exact UTF-8 sizing and
allocation-free writes to supplied storage without changing the template format.

The root marker is currently `data-svt-version="0"`; see [bindings and syntax](bindings.md). The
format is unreleased, with no compatibility promise or migration mechanism.

The specification must be usable without the .NET implementation or any consuming application. See
[design issues](https://github.com/bathos-labs/svt-dotnet/issues) for unresolved choices.
