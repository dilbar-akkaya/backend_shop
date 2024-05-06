import { APIGatewayProxyResult } from "aws-lambda";

export const generateHttpResponse = <T>(statusCode: number, response: T): APIGatewayProxyResult => {
  
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(response),
  };
};
  