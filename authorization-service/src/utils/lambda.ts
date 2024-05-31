import { APIGatewayProxyResult } from "aws-lambda";

export const generateHttpResponse = <T>(statusCode: number, response: T): APIGatewayProxyResult => {

    return {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token", 
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        },
        body: JSON.stringify(response),
    };
};