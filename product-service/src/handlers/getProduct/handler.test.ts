import { getProductsById } from "./handler";

describe("getProductsById function", () => {

    it("should with id 1 return response and the property body of this response should to equal equaledData ", async () => {

        const event = {
            body: null,
            headers: {},
            multiValueHeaders: {},
            httpMethod: "GET",
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
        const response = await getProductsById(event);
        const equaledData = {
            id: "1",
            title: "JavaScript: The Good Parts: The Good Parts",
            price: 30,
            description:
        "With JavaScript: The Good Parts, you'll discover a beautiful, elegant, lightweight and highly expressive language that lets you create effective code, whether you're managing object libraries or just trying to get Ajax to run fast. If you develop sites or applications for the Web, this book is an absolute must",
        };

        expect(JSON.parse(response!.body)).toEqual(equaledData);
    });
});