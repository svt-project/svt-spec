# Specification changelog

## 1.0.0 — working edition

- Establish SemVer editions for the portable specification and canonical reference assets.
- Require the exact template marker `data-svt-version="1.0"`. Remove the provisional marker `0`; no
  alternate reader or migration path is defined. Existing templates must be updated explicitly.
- Keep the metadata namespace `https://svt-project.github.io/ns/svt` and the separate conformance
  JSON envelope at version 0.
- Add canonical rejection cases for obsolete, unsupported and malformed template markers.

An edition becomes published when its reviewed immutable release tag is created. This changelog
records the working edition without claiming that a release has been published.
