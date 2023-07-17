[multipart-browser-parser](../README.md) / [Exports](../modules.md) / ParseResult

# Interface: ParseResult

Result of parsing of multipart data

## Table of contents

### Properties

- [bodyParts](ParseResult.md#bodyparts)
- [epilogue](ParseResult.md#epilogue)
- [preamble](ParseResult.md#preamble)

## Properties

### bodyParts

• **bodyParts**: `Response`[]

Separate Response objects parsed from multipart data

#### Defined in

index.ts:32

___

### epilogue

• **epilogue**: `Uint8Array`

Raw data of any epilogue present in multipart body

#### Defined in

index.ts:34

___

### preamble

• **preamble**: `Uint8Array`

Raw data of any preamble present in multipart body

#### Defined in

index.ts:30
