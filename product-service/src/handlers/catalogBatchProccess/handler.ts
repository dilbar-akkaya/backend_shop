import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { SQSEvent } from "aws-lambda";
import { REGION } from "../../constants";
import { v4 as uuidv4 } from "uuid";
import { newProductSchema } from "../createProduct/handler";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const dynamoDBClient = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: REGION })
);

const sns = new SNSClient();

export const catalogBatchProccess = async (event: SQSEvent) => {
    if (!event.Records || event.Records.length === 0) {
        throw new Error("Event doesn't have records");
    };

    const recordsArray = event.Records;

    for (const record of recordsArray) {
        const productFromBody = record.body;
        const product = newProductSchema.safeParse(JSON.parse(productFromBody));

        if (!product.success) {
            console.error("Invalid data", product.error);
            continue;
        };

        const newProductParams = {
            TableName: process.env.PRODUCTS_TABLE,
            Item: {
                id: uuidv4(),
                title: product.data.title,
                description: product.data.description,
                price: product.data.price
            }
        };
        const stockForNewProduct = {
            product_id: newProductParams.Item.id,
            count: product.data.count,
        };

        try {
            await dynamoDBClient.send(new TransactWriteCommand({
                TransactItems: [
                    {
                        Put: {
                            TableName: process.env.PRODUCTS_TABLE,
                            Item: newProductParams.Item
                        }
                    },
                    {
                        Put: {
                            TableName: process.env.STOCK_TABLE,
                            Item: stockForNewProduct
                        }
                    }
                ]
            }));

            const snsParams = {
                TopicArn: "arn:aws:sns:eu-west-1:637423586618:createProductTopic",
                Message: `New product with id ${newProductParams.Item.id} created`,
                Subject: "New product creation",
            };

            await sns.send(new PublishCommand(snsParams));
        } catch (err) {
            console.error("Error with record:", err);
            throw err;
        };

    };
};

