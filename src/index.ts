const CR = 0x0d;
const LF = 0x0a;
const CRLF = String.fromCharCode(CR, LF);

enum ParsingState {
  IN_PREAMBLE,
  IN_HEADER,
  AFTER_HEADER,
  IN_BODY_PART,
  IN_EPILOGUE,
}

/** User-supplied parser configuration */
export interface Options {
  /** Flag to set if your response does not contain a preamble and starts with the first part immediately, without a boundary string */
  rfcViolationNoFirstBoundary: boolean;
  /** Flag to set if the boundary in the Content-Type header already contains double-dash prefix and parser should not add it again */
  rfcViolationNoBoundaryPrefix: boolean;
}

/** @internal */
export const defaultOptions: Options = {
  rfcViolationNoFirstBoundary: false,
  rfcViolationNoBoundaryPrefix: false,
};

/** Result of parsing of multipart data */
export interface ParseResult {
  /** Raw data of any preamble present in multipart body */
  preamble: Uint8Array;
  /** Separate Response objects parsed from multipart data */
  bodyParts: Response[];
  /** Raw data of any epilogue present in multipart body */
  epilogue: Uint8Array;
}

/**
 * Parse a multipart Response object into separate Response objects
 * @param response Multipart Response object
 * @param userOptions User-supplied parser configuration
 * @returns Separate Response objects, together with any raw preamble and epilogue data
 */
export async function parseMultipartResponse(response: Response, userOptions?: Partial<Options>): Promise<ParseResult> {
  let body = await response.arrayBuffer();
  let boundary = getBoundary(response.headers.get("Content-Type") ?? "");
  if (!boundary) throw new ReferenceError("Boundary string is not present in Content-Type header.");
  return parse(body, boundary, userOptions);
}

/**
 * Parse raw multipart data into separate Response objects
 * @param body Multipart raw data
 * @param boundary Multipart boundar string
 * @param userOptions User-supplied parser configuration
 * @returns Separate Response objects, together with any raw preamble and epilogue data
 */
export function parse(body: ArrayBuffer | Uint8Array, boundary: string, userOptions?: Partial<Options>): ParseResult {
  let options = {...defaultOptions, ...userOptions};

  let bodyArray = body instanceof ArrayBuffer ? new Uint8Array(body) : body;
  let delimiter = options.rfcViolationNoBoundaryPrefix ? boundary : `--${boundary}`;
  let intermediateDelimiter = `${delimiter}${CRLF}`;
  let closeDelimiter = `${delimiter}--`;

  let state: ParsingState = options.rfcViolationNoFirstBoundary ? ParsingState.IN_HEADER : ParsingState.IN_PREAMBLE;
  let stringBuffer = "";
  let preamble = new Uint8Array(0);
  let headers = new Headers();
  let buffer: number[] = [];
  let bodyParts: Response[] = [];

  for (let i = 0; i < bodyArray.length; i++) {
    let currByte = bodyArray[i];
    let prevByte = bodyArray[i - 1];
    let isCR = currByte === CR;
    let isCRLF = prevByte === CR && currByte === LF;

    if (state !== ParsingState.IN_EPILOGUE) {
      stringBuffer += String.fromCharCode(currByte);
    }

    switch (state) {
      case ParsingState.IN_HEADER:

        if (isCRLF) {
          let [name, value] = stringBuffer.slice(0, -2).split(/:\s*/, 2);
          headers.append(name, value);

          state = ParsingState.AFTER_HEADER;
          stringBuffer = "";
        }

        break;

      case ParsingState.AFTER_HEADER:

        if (isCRLF) {
          state = ParsingState.IN_BODY_PART;
        } else if (!isCR) {
          state = ParsingState.IN_HEADER;
        }

        break;

      case ParsingState.IN_PREAMBLE:
      case ParsingState.IN_BODY_PART:

        buffer.push(currByte);

        if (stringBuffer === intermediateDelimiter || stringBuffer === closeDelimiter) {
          let data = Uint8Array.from(buffer.slice(0, -stringBuffer.length - CRLF.length));

          if (state === ParsingState.IN_PREAMBLE) {
            preamble = data;
          } else {
            bodyParts.push(new Response(data, {headers}));
          }

          state = stringBuffer === intermediateDelimiter ? ParsingState.IN_HEADER : ParsingState.IN_EPILOGUE;
          buffer = [];
          stringBuffer = "";
          headers = new Headers();
        } else if (isCRLF || stringBuffer.length > intermediateDelimiter.length) { // mem save
          stringBuffer = "";
        }

        break;

      case ParsingState.IN_EPILOGUE:

        buffer.push(currByte);
        break;
    }
  }

  let epilogue = Uint8Array.from(buffer);

  return {
    preamble,
    bodyParts,
    epilogue,
  };
}

/**
 * Parse a boundary string out of a header that contains it as a parameter
 * @param headerWithBoundary Raw header value or whole raw header
 * @returns Multipart boundary string
 */
export function getBoundary(headerWithBoundary: string): string | undefined {
  return headerWithBoundary.match(/;\s+boundary=(.*?)\s*(?:$|;)/)?.[1];
}
