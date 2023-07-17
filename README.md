
# multipart-browser-parser

![npm version](https://img.shields.io/npm/v/multipart-browser-parser)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

Got an obscure REST endpoint that returns a multipart response and need to parse it directly in browser? This is the package you are looking for! One response in, multiple responses out.


## Installation

Install using npm

```bash
  npm install multipart-browser-parser
```


## Example

```typescript
import {parseMultipartResponse} from "multipart-browser-parser";

async function getMultipartData() {
  let response = await fetch("/api/multipart");
  let {bodyParts} = await parseMultipartResponse(response);

  let firstPartAsText = await bodyParts[0].text();
  let secondPartAsJson = await bodyParts[1].json();

  return [firstPartAsText, secondPartAsJson];
}
```


## API Reference

### parseMultipartResponse

▸ **parseMultipartResponse**(`response`, `userOptions?`): `Promise`<[`ParseResult`](#parseresult)\>

Parse a multipart Response object into separate Response objects

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `response` | `Response` | Multipart Response object |
| `userOptions?` | `Partial`<[`Options`](#options)\> | User-supplied parser configuration |

#### Returns

`Promise`<[`ParseResult`](#parseresult)\>

Separate Response objects, together with any raw preamble and epilogue data

___

### parse

▸ **parse**(`body`, `boundary`, `userOptions?`): [`ParseResult`](#parseresult)

Parse raw multipart data into separate Response objects

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `body` | `ArrayBuffer` \| `Uint8Array` | Multipart raw data |
| `boundary` | `string` | Multipart boundar string |
| `userOptions?` | `Partial`<[`Options`](#options)\> | User-supplied parser configuration |

#### Returns

[`ParseResult`](#parseresult)
Separate Response objects, together with any raw preamble and epilogue data

___

### getBoundary

▸ **getBoundary**(`headerWithBoundary`): `string` \| `undefined`

Parse a boundary string out of a header that contains it as a parameter

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `headerWithBoundary` | `string` | Raw header value or whole raw header |

#### Returns

`string` \| `undefined`
Multipart boundary string

___

### ParseResult

Result of parsing of multipart data

• **bodyParts**: `Response`[]

Separate Response objects parsed from multipart data

• **preamble**: `Uint8Array`

Raw data of any preamble present in multipart body

• **epilogue**: `Uint8Array`

Raw data of any epilogue present in multipart body

___

### Options

User-supplied parser configuration

• **rfcViolationNoBoundaryPrefix**: `boolean`

Flag to set if the boundary in the Content-Type header already contains double-dash prefix and parser should not add it again

• **rfcViolationNoFirstBoundary**: `boolean`

Flag to set if your response does not contain a preamble and starts with the first part immediately, without a boundary string

___


## License

[MIT](https://choosealicense.com/licenses/mit/)

