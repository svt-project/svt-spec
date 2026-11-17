# SVT version-zero specification

The initial contract describes a structurally discoverable SVG document with named text, image and
paint inputs. Ordinary SVG values remain the authored preview. Templates retain `.svg` filenames.

SVG owns geometry, clipping, transforms, paint order, fonts and layout. Expressions, loops,
conditional elements, arbitrary attribute mutation, automatic text fitting and CSS precedence repair
are outside the initial scope.

The inspection contract is specified in these focused references:

- [Bindings and syntax](bindings.md)
- [Image values and resource ownership](images.md)
- [Authored defaults](defaults.md)
- [Inspection diagnostics and limits](inspection.md)

These contracts define implementation requirements, not completed functionality. Discovery preserves
raw authored values; it does not certify SVG validity or rendering. Optional value interpretation
and replacement-value APIs are separate responsibilities.

The format will use a version-zero envelope during unreleased development. No released compatibility
promise or migration mechanism exists yet.

The specification must be usable without the .NET implementation or any consuming application. See
[design issues](https://github.com/bathos-labs/svt-dotnet/issues) for unresolved choices.
