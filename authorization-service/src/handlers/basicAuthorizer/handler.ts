import { APIGatewayTokenAuthorizerEvent } from "aws-lambda";
import { ENCODING_BASE_64, UNICODE_UTF_8, resource, separators} from "../../constants";
import { Effect } from "../../types/effect";
import { generatePolicy } from "../../utils/generatePolicy";

export const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent) => { 
    const token = event.authorizationToken.split(separators[0])[1];  
    const credentialArray = Buffer.from(token, ENCODING_BASE_64).toString(UNICODE_UTF_8).split(separators[1]);
    const password = credentialArray[1];
    const login = credentialArray[0];
    const envPassword = process.env[login];
    
    if (envPassword !== password) {
        return generatePolicy(login, Effect.Deny, resource);
    };
    return generatePolicy(login, Effect.Allow, resource);
};