# Format identity and versioning

## Specification editions and template formats

The specification and canonical reference assets share a Semantic Versioning release series.
[version.json](../version.json) records the working specification edition, currently `1.0.0`, and
its template format, `1.0`. An edition is published under an immutable `vMAJOR.MINOR.PATCH` tag;
preparing the working edition does not itself publish that tag.

The SVG root must carry the unnamespaced attribute `data-svt-version="1.0"`. Its value identifies
one target template format using the specification's `MAJOR.MINOR` components. Patch revisions do
not appear in templates. The exact marker selects processing rules; it is not an implementation
package version, a version range or an instruction to use the latest rules.

| Edition change | Meaning                                                                                                              | Template marker                                            |
| -------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Patch          | Editorial corrections, clarifications that preserve existing requirements, or additional tests of those requirements | Unchanged                                                  |
| Minor          | Additive capabilities that preserve the meaning of existing valid templates                                          | New minor value for templates targeting those capabilities |
| Major          | Incompatible changes to established syntax or processing behavior                                                    | New major value                                            |

A correction that changes the meaning of valid templates requires an explicit compatibility review;
calling it an erratum does not make it an editorial patch. Published editions and their assets are
never replaced. The changelog identifies affected rules and whether implementation changes are
required. Implementation package versions evolve independently.

## Processor support

This edition defines only template format `1.0`. Processors must reject a missing or unsupported
root marker with `svt.version.invalid` and return no template. Values such as `0`, `1`, `1.0.0`,
`1.1`, `2.0`, `01.0`, whitespace-padded values and prerelease labels are not aliases for `1.0`.
Compare the XML-normalized attribute value exactly; do not trim, numerically normalize, infer a
version or try another format after rejection.

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
[fixture convention](../conformance/README.md) defines its field names and settings independently of
any implementation's object model. A template marker change does not renumber this envelope.

Implementations document their own package compatibility and CLI protocol policies. Fixture
envelopes do not define CLI versioning or omitted-field behavior.
