# Implementation impact of the RC.2 revision

The revision prepared as `1.0.0-rc.2` and adopted in `1.0.0` reduced portable obligations to SVT
semantics on conforming inputs. It retains template marker `1.0` and does not change namespace
identity. Publication and consumer adoption remain separate steps.

## Shared input keys

Group binding targets by key and require one input kind per group. Implementations that previously
rejected repeated text or image targets must now discover and replace all of them, including in
image-content bindings. Keep first-target order and label resolution, per-target default evidence,
one presentation entry per input and at most one assignment per key. Apply existing output limits to
the full expansion across the targets.

## Existing .NET implementation

The .NET implementation may retain its detailed diagnostics, exact source coordinates, bounded
streaming reader, UTF-16 input support, scoped hook rejection, metadata recovery and cancellation
semantics. These become implementation policy; simplifying the spec is not an instruction to remove
useful behavior or tests. Its existing stamped snapshot remains the edition it actually accepted.
The linked .NET
[inspection](https://github.com/svt-project/svt-dotnet/blob/master/docs/inspection-api.md),
[binding](https://github.com/svt-project/svt-dotnet/blob/master/docs/binding-api.md) and
[interpretation](https://github.com/svt-project/svt-dotnet/blob/master/docs/interpretation-api.md)
contracts own those API promises.

A future adoption change must update the runner's portable projection, review the new manifest and
stamp, and retain policy regressions under implementation ownership. Do not discard malformed-input,
resource-limit or recovery coverage merely because it is no longer canonical. Stronger behavior on
nonconforming input is compatible with this candidate; rejecting conforming supported templates for
arbitrary semantic reasons is not.

## Independent implementations and parser evaluation

Evaluate correct namespace-aware handling of conforming XML, preservation, hook/default/metadata
semantics, supported runtime environments, maintenance and packaging. A DOM, event parser or
source-span approach is eligible. Do not require custom namespace-URI validation, attribute-start
reconstruction, deterministic mixed-fault errors or a particular streaming limit API as portable
parser gates.

Operational safeguards, external-resolution controls and honest failure reporting still matter.
Review them against the host's threat and resource model, independently of semantic conformance.
This revision neither selects a TypeScript parser nor approves an archived dependency. Browser
Worker portability is a planned TypeScript runtime choice, not a template-format requirement.

## Canonical corpus changes

- Add inspection and substitution cases for shared text and image targets, including distinct
  authored values, per-target image attribute handling and omission.
- Remove conflict-isolation, malformed-byte, element-limit and invalid-metadata recovery cases.
- Remove unknown/duplicate binding-request policy cases.
- Remove diagnostic and source-location assertions from remaining inspection/substitution cases.
- Retain root/unsupported-marker rejection as a simple SVT identity boundary, without error codes.
- Correct the metadata-nonbinding example to refer to a real input, so its purpose is exclusion of
  embedded hooks rather than recovery from an unknown metadata key.
- Remove five optional-interpretation budget cases and all budget-option/result fields; retain value
  grammar/classification and named-color facts.

The JSON fixture envelope remains `0` during this reviewed prerelease change. That does not promise
that old runners can read new candidates. Snapshot adoption is explicit and no compatibility reader
or automatic migration is introduced. Earlier published assets remain available under their
immutable edition tag.
