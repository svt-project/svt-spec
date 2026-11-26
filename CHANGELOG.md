# Specification changelog

## 1.0.0-rc.2 — conforming-input contract

- Define SVT as template injection over ordinary XML processing. Preserve namespace identity, hooks,
  raw defaults, presentation and successful replacement semantics for conforming inputs.
- Delegate XML error detection to the processor; remove independent malformed-input validation and
  prescribed recovery. Keep root/format recognition and disabled external resolution.
- Make detailed diagnostics, source coordinates, validation precedence, partial salvage, resource
  counters, streaming architecture and cancellation mechanisms implementation policy.
- Require UTF-8 at encoded-input interchange; additional encodings such as UTF-16 are documented
  implementation capabilities. Do not require a byte-buffer API or custom decoding layer.
- Remove diagnostic/location fields and policy-only cases from the canonical corpus. Retain
  code-independent root/format rejection cases and successful semantic observations. Remove the
  optional interpretation budget profile while retaining its value grammar and results.
- Allow any number of same-kind targets to share one key. One text or image assignment now reaches
  every target of that input, as paint assignments already do. Each target retains its own authored
  value when the input is omitted. Mixed input kinds remain invalid.
- Keep template marker `1.0`, namespace identity and the prerelease JSON fixture envelope `0`.
  Fixture shape changes require an explicitly reviewed snapshot adoption; no compatibility reader is
  defined. Prior editions and accepted implementation snapshots remain unchanged.

This candidate admits repeated text and image targets that earlier candidate processors could
reject. Previously conforming templates retain their behavior. Each implementation explicitly adopts
the new contract and fixtures. See [implementation impact](implementation-impact.md).

## 1.0.0-rc.1 — candidate preparation

- Identify the initial specification candidate independently of implementation package releases.
- Support SemVer prerelease edition metadata without adding prerelease template markers.
- Establish SemVer editions for the portable specification and canonical reference assets.
- Require the exact template marker `data-svt-version="1.0"`. Remove the provisional marker `0`; no
  alternate reader or migration path is defined. Existing templates must be updated explicitly.
- Keep the metadata namespace `https://svt-project.github.io/ns/svt` and the separate conformance
  JSON envelope at version 0.
- Add canonical rejection cases for obsolete, unsupported and malformed template markers.

The candidate retains the processing rules and canonical fixture bytes from the earlier working
`1.0.0` snapshot accepted by the .NET RC.2 implementation. Only edition metadata, publication policy
and edition-validation tooling change; existing implementation provenance remains untouched.

An edition becomes published when its reviewed immutable release tag is created. This changelog
records the working edition without claiming that a release has been published.
