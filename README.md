# Scalable Vector Templates specification

SVT describes named text, paint and image inputs in ordinary SVG. Implementations inspect authored
values and apply replacements while SVG retains responsibility for layout and rendering.

- [Specification](spec/README.md): portable syntax, processing, metadata and optional
  interpretation.
- [Conformance reference assets](conformance/README.md): canonical inputs and expected observations.
- [.NET library and CLI](https://github.com/svt-project/svt-dotnet).
- [Project coordination](https://github.com/svt-project/.github/issues).

Technical Markdown, tables and supporting resources are reviewed together in this repository. A full
Git commit identifies a specification and reference-asset revision. Implementations explicitly adopt
stamped copies; subsequent changes here do not change their tests automatically. No live repository
dependency or site deployment is required.

The XML metadata namespace is `https://svt-project.github.io/ns/svt`; the template root marker is
`data-svt-version="0"`. See [format identity](spec/versions.md).

[Contributing](CONTRIBUTING.md) covers review and validation. Bathos is the founding maintainer.
Repository-authored text and assets are [MIT-licensed](LICENSE); see [NOTICE](NOTICE) and
[provenance](PROVENANCE.md).
