# Format identity and versioning

## Specification editions and template formats

The specification and canonical reference assets share a [Semantic Versioning](https://semver.org/)
release series. [version.json](../version.json) records the working specification edition, currently
`1.0.0-rc.2`, and its template format, `1.0`. An edition is published under an immutable
`v<specification_version>` tag, for example `v1.0.0-rc.1` or `v1.0.0`. Preparing the working edition
does not itself publish that tag.

The SVG root must carry the unnamespaced attribute `data-svt-version="1.0"`. Its value identifies
one target template format using the specification's `MAJOR.MINOR` components. Patch revisions,
prerelease identifiers and build metadata do not appear in templates. The exact marker selects
processing rules; it is not an implementation package version, a version range or an instruction to
use the latest rules.

| Edition change | Meaning                                                                                                              | Template marker                                            |
| -------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Patch          | Editorial corrections, clarifications that preserve existing requirements, or additional tests of those requirements | Unchanged                                                  |
| Minor          | Additive capabilities that preserve the meaning of existing valid templates                                          | New minor value for templates targeting those capabilities |
| Major          | Incompatible changes to established syntax or processing behavior                                                    | New major value                                            |

A correction that changes the meaning of valid templates requires an explicit compatibility review;
calling it an erratum does not make it an editorial patch. Published editions and their assets are
never replaced. The changelog identifies affected rules and whether implementation changes are
required. Implementation package versions evolve independently.

## Candidate editions and acceptance

A candidate such as `1.0.0-rc.1` identifies a reviewed proposal for template format `1.0`; it does
not establish the stable compatibility guarantees of the eventual `1.0.0` edition. Candidate
numbering is independent of implementation package numbering. A later candidate receives a new
edition and tag; published candidate text and reference assets are never replaced.

Before the first stable edition, explicitly reviewed candidate revisions may correct contract gaps
while retaining the intended `1.0` marker. Such changes must be described in the changelog and
explicitly adopted by implementations. The marker alone does not distinguish candidate revisions;
implementations must identify their accepted specification edition and exact snapshot. Do not infer
a candidate version from a template, add fallback readers, or silently adopt newer rules.

Formal `1.0.0` publication follows explicit acceptance, not merely removal of an RC suffix. The
[coordinator acceptance issue](https://github.com/svt-project/.github/issues/9) tracks production
use, independent implementation and cookbook findings, and implementation security review. After
stable publication, the edition-change rules above govern the established contract.

Existing implementation snapshots retain the metadata and provenance they actually accepted. An
earlier working snapshot labeled `1.0.0` was not a published stable edition; preparing this
candidate does not relabel that snapshot or force consumers to refresh unchanged reference bytes.

## Processor support

This edition defines only template format `1.0`. Processors must reject a missing or unsupported
root marker rather than interpret the document as supported SVT. Diagnostic details are
implementation policy. Values such as `0`, `1`, `1.0.0`, `1.1`, `2.0`, `01.0`, whitespace-padded
values and prerelease labels are not aliases for `1.0`. Compare the XML-normalized attribute value
exactly; do not trim, numerically normalize, infer a version or try another format after rejection.

Implementations declare the template formats they support. Future minor editions preserve existing
valid template meanings, but that does not imply that an older implementation understands a newer
format. Unsupported targets must be rejected rather than silently ignoring required new behavior.
Templates declare one target; implementations may explicitly support several agreed targets. No
version negotiation, automatic migration or speculative range-based reader is required.

## Metadata namespace

The metadata vocabulary uses the exact namespace name `https://svt-project.github.io/ns/svt`. The
name has no package or specification revision suffix. The `svt` prefix is an authoring convention,
not identity. SVG and RDF retain their own namespace names. Unnamespaced `data-svt-*` annotations
are independent of the metadata namespace declaration.

A metadata vocabulary identity change requires a separate namespace decision. Neither an edition nor
a document URL silently changes that identity. Do not infer alternate namespace names from versions
or fetch namespace documents during processing.

## Other versioned formats

The conformance corpus retains its JSON `format_version: 0` envelope. That envelope describes test
inputs and expectations; it is not the template format or a CLI request/response protocol. The
[fixture convention](../conformance/README.md) defines its field names independently of any
implementation's object model. A template marker change does not renumber this envelope.

Implementations document their own package compatibility and CLI protocol policies. Fixture
envelopes do not define CLI versioning or omitted-field behavior.
