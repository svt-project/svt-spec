# Inspection and implementation policy

Inspection discovers the inputs, authored defaults and optional presentation metadata of a
conforming SVT template. It does not modify the source. The portable observations are defined by
[bindings](bindings.md), [defaults](defaults.md) and [metadata](metadata.md).

## XML processing boundary

SVT is a template injection format layered on XML and SVG. It does not define another XML parser,
XML validation suite or error-recovery algorithm. Conforming templates use well-formed XML 1.0 with
conforming XML namespaces and no DTD. XML supplies element structure, expanded names, character
references, and text and attribute normalization.

An implementation may use an ordinary namespace-aware XML processor and its normal XML mode. It need
not independently certify XML well-formedness, validate namespace URI syntax, repair a parser's
handling of malformed input, or reproduce another processor's error reporting. Correct handling of
conforming documents remains required: namespace prefixes are aliases, default namespace scope
matters, and XML-processed values must not acquire additional trimming or coercion. HTML parsing and
heuristic searches that misinterpret conforming XML are not equivalent substitutes.

When the XML processor reports a parsing failure, fail the operation. No result or diagnostic
sequence is otherwise prescribed for malformed XML, invalid byte sequences or illegal namespace
declarations. SVT does not require repair or partial discovery of such documents. This does not
relax the processing requirements for valid foreign namespaces, character references or whitespace.

DTD-dependent documents are outside the format. Implementations must not enable external entity,
schema or namespace-document resolution as part of SVT processing. Use the processor's facilities to
disable DTD processing or reject a reported DTD; no independent DTD grammar is required. SVG image
references remain inert strings during inspection and binding.

## Input and identity

The specification does not prescribe a byte-buffer API, DOM API or string API. UTF-8 is the common
byte interchange encoding; implementations accepting encoded XML support UTF-8 and document any
additional encodings. XML declarations and decoding follow the chosen processor's normal rules.
Support for UTF-16 input is an implementation capability, not an SVT-specific decoding obligation.
Callers supplying decoded text or an XML document own the preceding decoding step.

Check the root's expanded name and exact template marker as described in
[format identity](versions.md). An unsupported root or marker must not be treated as a supported SVT
template. Error codes, exception types and the order of these checks are implementation policy.

## Nonconforming templates and requests

The specification defines successful behavior for conforming templates and binding requests. Empty
hook keys, incompatible targets, conflicting input identities and invalid recognized metadata are
outside that contract. Implementations may reject the template or recover usable portions under a
documented policy. SVT does not require partial salvage, field-level fallback, rejected-key
bookkeeping, or a particular set or order of warnings. Recovery behavior is not portable and must
not be relied on for interchange.

Foreign content and the explicitly ignored constructs in the binding and metadata rules remain valid
content with defined behavior. They are not a reason to reject a conforming template. Unfamiliar SVG
elements, paint strings and resource references are not SVT validation failures. Optional value
interpretation never gates inspection or binding.

## Diagnostics and operational controls

Implementations own diagnostic codes, severity, messages, ordering, related findings and recovery.
Source locations are optional and best-effort; implementations document their coordinate system.
There is no requirement to reconstruct attribute-start positions or match another parser's offsets.
An implementation may offer richer authoring validation without making it part of SVT conformance.

Implementations also own resource limits, counting units, defaults, cancellation, memory ownership
and error transport. Document supported operating limits and enforce resource controls appropriate
to the host and input trust boundary. Resource controls and disabled external resolution still apply
to nonconforming input. GIGO is not permission for external access or uncontrolled resource
consumption. No particular counters, failure precedence, streaming architecture, allocation bound or
cancellation checkpoints are prescribed by this format.

An implementation may use a DOM, streaming events or a source-span representation. Finite limits may
reject otherwise conforming templates; conformance tests must run within the implementation's
documented capabilities. Limit exhaustion is an operational failure, not an alternate successful
interpretation of a template. Failures and cancellation must not be reported as successful complete
results; any partial observations are implementation-specific and cannot be used as conformance
results.

## Conformance boundary

The [canonical references](../conformance/README.md) compare input discovery, defaults, presentation
and binding results. They do not certify parser error detection, exact diagnostics, recovery,
resource thresholds or API design. Implementations retain their own regression and adversarial input
tests for those responsibilities. Successful SVT processing does not certify SVG validity, resource
safety or rendered appearance.
