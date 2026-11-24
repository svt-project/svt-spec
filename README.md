# Scalable Vector Templates specification

SVT describes named text, paint and image inputs in ordinary SVG. Implementations inspect authored
values and apply replacements while SVG retains responsibility for layout and rendering.

- [Specification](spec/README.md): portable syntax, processing, metadata and optional
  interpretation.
- [Conformance reference assets](conformance/README.md): canonical inputs and expected observations.
- [.NET library and CLI](https://github.com/svt-project/svt-dotnet).
- [Project coordination](https://github.com/svt-project/.github/issues).

Technical Markdown, tables and supporting resources are reviewed together in this repository.
Specification editions use Semantic Versioning; [version.json](version.json) records the working
edition and its template format. The working candidate is `1.0.0-rc.1`, targeting template format
`1.0`. Published editions use immutable `v<specification_version>` tags, including prerelease
suffixes; preparing a candidate does not publish its tag. A full Git commit and asset digest
identify the exact reference snapshot. Implementations explicitly adopt stamped copies; subsequent
changes here do not change their tests automatically. No live repository dependency or site
deployment is required.

The XML metadata namespace is `https://svt-project.github.io/ns/svt`; the template root marker is
`data-svt-version="1.0"`. See [format identity](spec/versions.md).

[Contributing](CONTRIBUTING.md) covers review and validation. Bathos is the founding maintainer.
Repository-authored text and assets are [MIT-licensed](LICENSE); see [NOTICE](NOTICE) and
[provenance](PROVENANCE.md).
