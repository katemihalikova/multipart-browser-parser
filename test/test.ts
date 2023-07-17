import {parseMultipartResponse, parse, getBoundary} from "../src/index";
import baretest from "baretest";
import * as assert from "assert";
import {readFileSync} from "fs";

const test = baretest("multipart-browser-parser");

const boundary = "Uz6QGCGb3RCFt6GVSHML5O0iA2DUUq2d033";
const textEncoder = new TextEncoder();
const correctDump = textEncoder.encode(readFileSync(`${__dirname}/test1.multipart`, 'utf-8'));
const correctDumpResponse = new Response(correctDump, {headers: {"Content-Type": `multipart/mixed; boundary=${boundary}`}});
const rfcViolationDump = textEncoder.encode(readFileSync(`${__dirname}/test2.multipart`, 'utf-8'));
const plainDump = textEncoder.encode(readFileSync(`${__dirname}/test3.multipart`, 'utf-8'));

const textDecoder = new TextDecoder();

test("parseMultipartResponse", async () => {
  let {bodyParts, preamble, epilogue} = await parseMultipartResponse(correctDumpResponse);

  assert.strictEqual(bodyParts.length, 2);
  assert.strictEqual(bodyParts[0].headers.get("Content-Type"), "text/plain");
  assert.strictEqual(await bodyParts[0].text(), "Hello everyone!💜");
  assert.strictEqual(bodyParts[1].headers.get("Content-Type"), "application/json");
  assert.deepStrictEqual(await bodyParts[1].json(), {"this": ["is", {"a": "test"}]});

  assert.strictEqual(textDecoder.decode(preamble), "preamble");
  assert.strictEqual(textDecoder.decode(epilogue), "\r\nepilogue");
});

test("parse", async () => {
  let {bodyParts, preamble, epilogue} = parse(correctDump, boundary);

  assert.strictEqual(bodyParts.length, 2);
  assert.strictEqual(bodyParts[0].headers.get("Content-Type"), "text/plain");
  assert.strictEqual(await bodyParts[0].text(), "Hello everyone!💜");
  assert.strictEqual(bodyParts[1].headers.get("Content-Type"), "application/json");
  assert.deepStrictEqual(await bodyParts[1].json(), {"this": ["is", {"a": "test"}]});

  assert.strictEqual(textDecoder.decode(preamble), "preamble");
  assert.strictEqual(textDecoder.decode(epilogue), "\r\nepilogue");
});

test("parse (RFC violation)", async () => {
  let {bodyParts, preamble, epilogue} = parse(rfcViolationDump, `--${boundary}`, {rfcViolationNoBoundaryPrefix: true, rfcViolationNoFirstBoundary: true});

  assert.strictEqual(bodyParts.length, 2);
  assert.strictEqual(bodyParts[0].headers.get("Content-Type"), "text/plain");
  assert.strictEqual(await bodyParts[0].text(), "Hello everyone!💜");
  assert.strictEqual(bodyParts[1].headers.get("Content-Type"), "application/json");
  assert.deepStrictEqual(await bodyParts[1].json(), {"this": ["is", {"a": "test"}]});

  assert.strictEqual(textDecoder.decode(preamble), "");
  assert.strictEqual(textDecoder.decode(epilogue), "\r\nepilogue");
});

test("parse (no preamble nor epilogue)", async () => {
  let {bodyParts, preamble, epilogue} = parse(plainDump, boundary);

  assert.strictEqual(bodyParts.length, 2);
  assert.strictEqual(bodyParts[0].headers.get("Content-Type"), "text/plain");
  assert.strictEqual(await bodyParts[0].text(), "Hello everyone!💜");
  assert.strictEqual(bodyParts[1].headers.get("Content-Type"), "application/json");
  assert.deepStrictEqual(await bodyParts[1].json(), {"this": ["is", {"a": "test"}]});

  assert.strictEqual(textDecoder.decode(preamble), "");
  assert.strictEqual(textDecoder.decode(epilogue), "");
});

test("getBoundary", () => {
  assert.strictEqual(getBoundary("Content-Type: multipart/mixed; boundary=dM5CJdNrCJ"), "dM5CJdNrCJ")
  assert.strictEqual(getBoundary("multipart/mixed; boundary=krhWk48TFH"), "krhWk48TFH")
  assert.strictEqual(getBoundary("multipart/mixed; boundary=OFq7rx5VEd; charset=utf-8"), "OFq7rx5VEd")
})

test.run();
