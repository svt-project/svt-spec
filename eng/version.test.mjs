import test from "node:test";
import assert from "node:assert/strict";
import { templateFormatForVersion } from "./version.mjs";

test("stable and candidate editions select only their major/minor template marker", () => {
  for (const version of ["1.0.0", "1.0.1", "1.0.0-rc.1", "1.0.0-rc.2", "1.0.0-alpha.0"]) {
    assert.equal(templateFormatForVersion(version), "1.0");
  }
  assert.equal(templateFormatForVersion("1.2.3-rc.1+build.001"), "1.2");
  assert.equal(templateFormatForVersion("2.0.0+001"), "2.0");
  assert.equal(templateFormatForVersion("0.1.0-x-y-z.--"), "0.1");
  assert.equal(templateFormatForVersion("1.0.0-01a"), "1.0");
});

test("malformed editions are rejected without trimming or coercion", () => {
  for (const version of [
    undefined,
    null,
    1,
    {},
    "",
    "1.0",
    "v1.0.0",
    "01.0.0",
    "1.00.0",
    "1.0.00",
    "1.0.0-rc.01",
    "1.0.0-00",
    "1.0.0-rc..1",
    "1.0.0-",
    "1.0.0+",
    "1.0.0+a..b",
    "1.0.0-rc_1",
    "1.0.0-rç.1",
    " 1.0.0",
    "1.0.0 ",
    "1.0.0\n",
    "1.0.0-rc.1\n",
  ])
    assert.throws(() => templateFormatForVersion(version));
});
