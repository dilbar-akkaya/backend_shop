import AWSMock from "aws-sdk-mock";
import AWS from "aws-sdk";
import { IProduct } from "../../types/products";
import { v4 as uuidv4 } from "uuid";
import { SQSEvent } from "aws-lambda";
import { catalogBatchProccess } from "./handler";

AWSMock.setSDKInstance(AWS);

describe("catalogBatchProccess", () => {

    it("should publish message to SNS", async () => {

        const mockeryDynamoDB = jest.fn((_params: unknown, callback: (err: Error | null, data: IProduct | null) => void) => {
            console.log("Trans was called");
            const product: IProduct = {
                title: "Test1",
                description: "Test1 Description",
                price: 100,
                id: uuidv4(),
            };
            callback(null, product);
        });
        
        AWSMock.mock("DynamoDB.DocumentClient", "transactWrite", mockeryDynamoDB);

        const mockerySNS = jest.fn();

        AWSMock.mock("SNS", "publish", mockerySNS);
        
        const newProduct = {
            title: "Test1",
            description: "Test1 Description",
            price: 100,
            count: 1
        };
        const event: SQSEvent = {
            Records: [
                {
                    messageId: "059f36b4-87a3-44ab-83d2-661975830a7d",
                    receiptHandle: "AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...",
                    body: JSON.stringify(newProduct),
                    attributes: {
                        "ApproximateReceiveCount": "1",
                        "SentTimestamp": "1545082649183",
                        "SenderId": "AIDAIENQZJOLO23YVJ4VO",
                        "ApproximateFirstReceiveTimestamp": "1545082649185"
                    },
                    messageAttributes: {},
                    md5OfBody: "e4e68fb7bd0e697a0ae8f1bb342846b3",
                    eventSource: "aws:sqs",
                    eventSourceARN: "arn:aws:sqs:eu-west-1:637423586618:catalogItemsQueue",
                    awsRegion: "eu-west-1"
                }
            ]
        };

        await catalogBatchProccess(event);

        expect(mockeryDynamoDB).toHaveBeenCalledTimes(1);
        expect(mockerySNS).toHaveBeenCalledTimes(1);

        AWSMock.restore("DynamoDB.DocumentClient");
        AWSMock.restore("SNS");
    });
});
/*
import { SQSEvent } from "aws-lambda";
import { catalogBatchProccess } from "./handler";

const mockDynamoDBClient = jest.fn(() => ({
    send: jest.fn()
}));
const mockSNSClient = jest.fn(() => ({
    send: jest.fn()
}));
jest.mock("@aws-sdk/client-dynamodb", () => ({
    DynamoDBClient: mockDynamoDBClient
}));
jest.mock("@aws-sdk/client-sns", () => ({
    SNSClient: mockSNSClient
}));

it("should publish message to SNS", async () => {

    const sendMockTransact = jest.fn();
    const sendMockPublish = jest.fn();

    mockDynamoDBClient.mockReturnValue({
        send: sendMockTransact
    });

    mockSNSClient.mockReturnValue({
        send: sendMockPublish
    });

    const newProduct = {
        title: "Test1",
        description: "Test1 Description",
        price: 100,
        count: 1
    };
    const event: SQSEvent = {
        Records: [
            {
                messageId: "059f36b4-87a3-44ab-83d2-661975830a7d",
                receiptHandle: "AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...",
                body: JSON.stringify(newProduct),
                attributes: {
                    "ApproximateReceiveCount": "1",
                    "SentTimestamp": "1545082649183",
                    "SenderId": "AIDAIENQZJOLO23YVJ4VO",
                    "ApproximateFirstReceiveTimestamp": "1545082649185"
                },
                messageAttributes: {},
                md5OfBody: "e4e68fb7bd0e697a0ae8f1bb342846b3",
                eventSource: "aws:sqs",
                eventSourceARN: "arn:aws:sqs:eu-west-1:637423586618:catalogItemsQueue",
                awsRegion: "eu-west-1"
            }
        ]
    };
    await catalogBatchProccess(event);

    expect(sendMockTransact).toHaveBeenCalledTimes(1); 
    expect(sendMockPublish).toHaveBeenCalledTimes(1);
});*/