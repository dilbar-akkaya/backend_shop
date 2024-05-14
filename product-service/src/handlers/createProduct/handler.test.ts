import { createProduct } from "./handler";
import * as AWSMock from "aws-sdk-mock";
import * as AWS from "aws-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";
import { IProduct } from "../../types/products";
import { v4 as uuidv4 } from "uuid";

AWSMock.setSDKInstance(AWS);

describe("createProduct", () => {
    let event: APIGatewayProxyEvent;

    beforeEach(() => {
        const newProduct = {
            title: "Test1",
            description: "Test1 Description",
            price: 100,
            count: 1
        };
        event = {
            body: JSON.stringify(newProduct),
            headers: {},
            multiValueHeaders: {},
            httpMethod: "POST",
            isBase64Encoded: false,
            path: "/",
            pathParameters: { productId: "1" },
            queryStringParameters: null,
            multiValueQueryStringParameters: null,
            stageVariables: null,
            requestContext: {
                accountId: "",
                apiId: "",
                authorizer: null,
                protocol: "",
                httpMethod: "",
                identity: {
                    accessKey: null,
                    accountId: null,
                    apiKey: null,
                    apiKeyId: null,
                    caller: null,
                    clientCert: null,
                    cognitoAuthenticationProvider: null,
                    cognitoAuthenticationType: null,
                    cognitoIdentityId: null,
                    cognitoIdentityPoolId: null,
                    principalOrgId: null,
                    sourceIp: "",
                    user: null,
                    userAgent: null,
                    userArn: null,
                },
                path: "",
                stage: "",
                requestId: "",
                resourceId: "",
                resourcePath: "",
                requestTimeEpoch: 0,
            },
            resource: "",
        };
    
        AWSMock.mock("DynamoDB.DocumentClient", "transactWrite", (params:unknown , callback: (err: Error | null, data: IProduct | null) => void) => {
            const product: IProduct = {
                title: "Test1",
                description: "Test1 Description",
                price: 100,
                id: uuidv4(),
            };
            callback(null, product);
        });
    });

    afterEach(() => {
        AWSMock.restore("DynamoDB.DocumentClient");
    });

    it("should return code 500 and error message", async () => {
        AWSMock.restore("DynamoDB.DocumentClient");
        AWSMock.mock("DynamoDB.DocumentClient", "transactWrite", (_params: unknown, callback:  (err: Error | null, data: IProduct | null) => void) => {
            callback(new Error("Test error"), null);
        });

        const result = await createProduct(event);
        const body = JSON.parse(result?.body || "") as { message: string };

        expect(result?.statusCode).toEqual(500);
        expect(body.message).toBeDefined();
    });
});
