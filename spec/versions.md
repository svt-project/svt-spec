# Format identity and versioning

The SVG root marker `data-svt-version="0"` identifies the SVT template format. The marker is
independent of implementation package versions and specification publication revisions. Format 0
remains the supported template format at the .NET implementation's stable 1.0 release; zero does not
mean that a processor may reinterpret the document using its latest rules.

The metadata vocabulary uses the exact namespace name `https://svt-project.github.io/ns/svt`. The
name has no package or specification revision suffix. The `svt` prefix is an authoring convention,
not identity. SVG and RDF retain their own namespace names. Unnamespaced `data-svt-*` annotations
are independent of the metadata namespace declaration.

An incompatible template format requires a new explicit root marker and an agreed specification. A
metadata vocabulary identity change requires a separate namespace decision; neither a package
version nor a new document URL silently changes the meaning of an established vocabulary. Do not
infer alternate namespace names from versions or fetch namespace documents during processing.

The conformance corpus uses its own JSON `format_version: 0` envelope. That envelope describes test
inputs and expectations; it is not a CLI request or response protocol. The
[fixture convention](../conformance/README.md) defines its field names and settings independently of
any implementation's object model.

Package compatibility and support periods belong to implementations. The .NET implementation's
[compatibility policy](compatibility.md) defines its stable support commitments and
[CLI contract](cli.md) defines command JSON versioning, including omitted-version behavior.
