import { DynamoDBDocumentClient, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { SNSClient, PublishCommand, PublishCommandOutput } from "@aws-sdk/client-sns";
import { mockClient } from "aws-sdk-client-mock";
import { catalogBatchProccess } from "./handler";
import { SQSEvent } from "aws-lambda";

const mockDynamoDB = mockClient(DynamoDBDocumentClient);
const mockSNS = mockClient(SNSClient);

describe("catalogBatchProccess", () => {
    beforeEach(() => {
        mockDynamoDB.reset();
        mockSNS.reset();
    });

    it("should add product to DynamoDB and publish SNS", async () => {
        const mockEvent = {
            Records: [
                { body: JSON.stringify({ title: "Test product", description: "Test", price: 100, count: 10 }) }
            ]
        };
        const mockDynamoDBResponse = { ConsumedCapacity: [] };
        const mockSNSResponse: PublishCommandOutput = {
            $metadata: {
                httpStatusCode: 200,
                requestId: "test-id",
                extendedRequestId: "test-id",
                cfId: undefined,
                attempts: 0,
                totalRetryDelay: 0
            },
            MessageId: "test message"
        };

        mockDynamoDB.on(TransactWriteCommand).resolves(mockDynamoDBResponse);
        mockSNS.on(PublishCommand).resolves(mockSNSResponse);

        await catalogBatchProccess(mockEvent as SQSEvent);

        expect(mockDynamoDB.calls()).toHaveLength(1);
        expect(mockSNS.calls()).toHaveLength(1);
    });

    it("should throw error if records is empty", async () => {
        const mockEvent = { Records: [] };

        await expect(catalogBatchProccess(mockEvent as SQSEvent))
            .rejects
            .toThrow("Event doesn't have records");
    });

});