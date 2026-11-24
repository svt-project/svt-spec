# Specification changelog

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
