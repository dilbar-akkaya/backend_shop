import { APIGatewayTokenAuthorizerEvent } from "aws-lambda";
import { ENCODING_BASE_64, UNICODE_UTF_8, resource, separators} from "../../constants";
import { Effect } from "../../types/effect";
import { generatePolicy } from "../../utils/generatePolicy";

export const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent) => { 
    if (!event.authorizationToken) {
        return generatePolicy("user", Effect.Deny, resource);
    };

    const authArray = event.authorizationToken.split(separators[0]);

    if (authArray.length < 2) {
        return generatePolicy("user", Effect.Deny, resource);
    };

    const token = authArray[1];  
    const credentialArray = Buffer.from(token, ENCODING_BASE_64).toString(UNICODE_UTF_8).split(separators[1]);
    
    if (credentialArray.length < 2) {
        return generatePolicy("user", Effect.Deny, resource);
    };
    
    const password = credentialArray[1];
    const login = credentialArray[0];
    const envPassword = process.env[login];
    
    if (envPassword !== password) {
        return generatePolicy(login, Effect.Deny, resource);
    };

    return generatePolicy(login, Effect.Allow, resource);
};