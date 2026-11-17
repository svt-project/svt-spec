# Specification scope

The initial contract describes a renderable SVG document with named literal text, image and solid
RGB color inputs. Ordinary SVG values remain the authored preview. Templates retain `.svg`
filenames.

SVG owns geometry, clipping, transforms, paint order, fonts and layout. Expressions, loops,
conditional elements, arbitrary attribute mutation, automatic text fitting and CSS precedence repair
are outside the initial scope.

The normative syntax is not frozen. Before implementation, the specification must distinguish
tolerant input discovery from strict authoring conformance, and an authored default from a
statically readable literal value. A self-contained portable authoring profile is proposed
separately from host-managed resource references.

The format will use a version-zero envelope during unreleased development. No released compatibility
promise or migration mechanism exists yet.

The specification must be usable without the .NET implementation or any consuming application. See
[design issues](https://github.com/bathos-labs/svt-dotnet/issues) for unresolved choices.
