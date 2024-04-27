import { HttpResponse } from "../types/types";

export const generateHttpResponse = <T>(statusCode: number, response: T): HttpResponse => {
    return {
      statusCode: statusCode,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(response),
    };
  };
  