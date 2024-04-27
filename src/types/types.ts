export interface HttpResponse {
    statusCode: number;
    headers: {
      "Access-Control-Allow-Origin": string;
    }
    body: string;
  }

  export enum StatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    SERVER_ERROR = 500
  }