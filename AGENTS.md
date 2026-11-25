# Agent guidance

- Use American English. Work serially; request approval before delegating.
- Check Git status and preserve unrelated work. Default branch: master.
- This repository owns portable SVT contracts and canonical conformance reference assets. Keep
  implementation APIs, CLI/package policy and cookbook/site content in their respective projects.
- Discuss consequential format, vocabulary, diagnostic, ownership or compatibility changes before
  implementation. This is prerelease; add no migrations, aliases or compatibility readers.
- Preserve MIT licensing and attribution to Bathos Pty Ltd. Keep private paths, credentials, IDE
  state and generated evidence out of commits.
- Specification editions use SemVer, including candidate suffixes; prepare 1.0.0-rc.2 without
  publishing a tag. Templates declare only the major/minor format, currently 1.0. Reject unsupported
  markers, including 0; preserve the independent JSON envelope version 0.
- Implementations adopt stamped copies explicitly; do not introduce live consumer dependencies.
- Define portable behavior for conforming inputs. Keep detailed diagnostics, recovery, source
  coordinates and resource-limit mechanisms in implementation policy, not canonical expectations.
- Keep normative contracts separate from informative renderer guidance. No renderer or .NET build is
  required to read or validate this repository.
- Run `node eng/check.mjs` after edits. For intentional canonical asset changes, regenerate and
  review the inventory with `node eng/assets.mjs --write`. Validate behavior in the affected
  implementations.
- Use GitHub issues for proposals and delivery tracking. Do not publish release tags or packages
  without explicit authorization.
