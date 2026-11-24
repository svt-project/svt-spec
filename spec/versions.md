# Format identity and versioning

The SVG root marker `data-svt-version="0"` identifies the SVT template format. The marker is
independent of implementation package versions and specification publication revisions. Zero
identifies this format; it does not mean that a processor may reinterpret a document using its
latest rules.

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

Implementations document supported format revisions and their own compatibility/support policy. CLI
request and response protocols are separate implementation contracts; fixture envelopes do not
define their versioning or omitted-field behavior.
