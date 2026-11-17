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

Inspection reports `Welcome` as the authored default. A future binding call would address `heading`,
not `Main heading`. Omitting that input when binding preserves the original text. Inspection itself
never changes the SVG; substitution is specified but not yet implemented.

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
- Without a nonempty label, the key is also the display label. Labels trim XML whitespace; keys
  remain exact and case-sensitive.
- A label applies to every hook on its element. For a shared paint input, the first target supplies
  the label; differing labels produce a warning.
- Text and image inputs each have one target. Paint inputs may share a key across fill and stroke
  targets. Reusing a key across different input kinds is an error.

Descriptions and centralized input metadata are not part of the current format. SVG content remains
the source of authored defaults.

## Detailed contracts

The inspection contract is specified in these focused references:

- [Bindings and syntax](bindings.md)
- [Image values and resource ownership](images.md)
- [Authored defaults](defaults.md)
- [Inspection diagnostics and limits](inspection.md)
- [Substitution policies, diagnostics and limits](substitution.md)
- [.NET binding API](../docs/binding-api.md)

Structural inspection is implemented; substitution remains a contract for later implementation.
Discovery preserves raw authored values; it does not certify SVG validity or rendering. Optional
value interpretation and replacement-value APIs are separate responsibilities.

The root marker is currently `data-svt-version="0"`; see [bindings and syntax](bindings.md). The
format is unreleased, with no compatibility promise or migration mechanism.

The specification must be usable without the .NET implementation or any consuming application. See
[design issues](https://github.com/bathos-labs/svt-dotnet/issues) for unresolved choices.
