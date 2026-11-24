import assert from "node:assert/strict";

// Validate SemVer edition identity; this does not select processor behavior or compare versions.
export function templateFormatForVersion(version) {
  assert.equal(typeof version, "string", "Specification edition must be a SemVer string");
  const match =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/.exec(
      version,
    );
  assert.ok(match && match[0] === version, "Invalid SemVer specification edition");
  for (const identifier of match[4]?.split(".") ?? []) {
    assert.ok(
      !/^0\d+$/.test(identifier),
      "Numeric prerelease identifiers cannot have leading zeros",
    );
  }
  return `${match[1]}.${match[2]}`;
}
