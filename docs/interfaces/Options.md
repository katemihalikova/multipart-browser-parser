[multipart-browser-parser](../README.md) / [Exports](../modules.md) / Options

# Interface: Options

User-supplied parser configuration

## Table of contents

### Properties

- [rfcViolationNoBoundaryPrefix](Options.md#rfcviolationnoboundaryprefix)
- [rfcViolationNoFirstBoundary](Options.md#rfcviolationnofirstboundary)

## Properties

### rfcViolationNoBoundaryPrefix

• **rfcViolationNoBoundaryPrefix**: `boolean`

Flag to set if the Content-Type header already contains

#### Defined in

index.ts:18

___

### rfcViolationNoFirstBoundary

• **rfcViolationNoFirstBoundary**: `boolean`

Flag to set if your response does not contain a preamble and starts with the first part immediately, without a boundary string

#### Defined in

index.ts:16
