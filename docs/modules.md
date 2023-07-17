[multipart-browser-parser](README.md) / Exports

# multipart-browser-parser

## Table of contents

### Interfaces

- [Options](interfaces/Options.md)
- [ParseResult](interfaces/ParseResult.md)

### Variables

- [defaultOptions](modules.md#defaultoptions)

### Functions

- [getBoundary](modules.md#getboundary)
- [parse](modules.md#parse)
- [parseMultipartResponse](modules.md#parsemultipartresponse)

## Variables

### defaultOptions

• `Const` **defaultOptions**: [`Options`](interfaces/Options.md)

#### Defined in

index.ts:22

## Functions

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

#### Defined in

index.ts:150

___

### parse

▸ **parse**(`body`, `boundary`, `userOptions?`): [`ParseResult`](interfaces/ParseResult.md)

Parse raw multipart data into separate Response objects

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `body` | `ArrayBuffer` \| `Uint8Array` | Multipart raw data |
| `boundary` | `string` | Multipart boundar string |
| `userOptions?` | `Partial`<[`Options`](interfaces/Options.md)\> | User-supplied parser configuration |

#### Returns

[`ParseResult`](interfaces/ParseResult.md)

Separate Response objects, together with any raw preamble and epilogue data

#### Defined in

index.ts:57

___

### parseMultipartResponse

▸ **parseMultipartResponse**(`response`, `userOptions?`): `Promise`<[`ParseResult`](interfaces/ParseResult.md)\>

Parse a multipart Response object into separate Response objects

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `response` | `Response` | Multipart Response object |
| `userOptions?` | `Partial`<[`Options`](interfaces/Options.md)\> | User-supplied parser configuration |

#### Returns

`Promise`<[`ParseResult`](interfaces/ParseResult.md)\>

Separate Response objects, together with any raw preamble and epilogue data

#### Defined in

index.ts:43
