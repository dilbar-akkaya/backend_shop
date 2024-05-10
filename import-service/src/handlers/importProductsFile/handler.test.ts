import { importProductsFile } from "./handler";
import { generateHttpResponse } from "../../utils/lambda";
import { StatusCode } from "../../types/http";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APIGatewayProxyEvent } from "aws-lambda";

jest.mock("@aws-sdk/client-s3", () => {
    return {
        S3Client: jest.fn(() => ({ send: jest.fn() })),
        PutObjectCommand: jest.fn(() => ({})),
    };
});

jest.mock("@aws-sdk/s3-request-presigner");

describe("Test function importProductsFile", () => {
    it("should return signed URL", async () => {
        const event = {
            queryStringParameters: {
                name: "test.csv",
            },
        } as unknown as APIGatewayProxyEvent;
    
        const testUrl = "https://test.com/signed-url";

        (getSignedUrl as jest.Mock).mockReturnValue(testUrl);

        const response = await importProductsFile(event);

        expect(response).toEqual(generateHttpResponse(StatusCode.OK, testUrl));
    });
});