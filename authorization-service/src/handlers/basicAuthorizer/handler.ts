import { APIGatewayProxyEvent } from "aws-lambda";
import { generateHttpResponse } from "../../utils/lambda";
import { StatusCode } from "../../types/http";
import { ENCODING_BASE_64, UNICODE_UTF_8, failedMessage, separators, successfulMessage, unauthorized } from "../../constants";

export const basicAuthorizer = async (event: APIGatewayProxyEvent) => { 
    if (!event.headers.Authorization) {
        return generateHttpResponse(StatusCode.UNAUTHORIZED, unauthorized);
    };

    const token = event.headers.Authorization?.split(separators[0])[1]; 
    const credentialArray = Buffer.from(token, ENCODING_BASE_64).toString(UNICODE_UTF_8).split(separators[1]);
    const password = credentialArray[1];
    const envPassword = process.env.dilbarakkaya;
  
    if (envPassword !== password) {
        return generateHttpResponse(StatusCode.FORBIDDEN, failedMessage);
    };

    return generateHttpResponse(StatusCode.OK, successfulMessage);
};