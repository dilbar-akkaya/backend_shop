import { APIGatewayProxyEvent } from "aws-lambda";
import { generateHttpResponse } from "../../utils/lambda";
import { StatusCode } from "../../types/http";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DB_PRODUCTS, REGION } from "../../constants";

const dynamoDBClient = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: REGION })
);

export const getProductsById = async (event: APIGatewayProxyEvent) => {
    console.log("Event:", event);
    if (event.pathParameters === null) {
        return generateHttpResponse(StatusCode.BAD_REQUEST, event.pathParameters);
    };

    if (!event.pathParameters.productId) {
        return generateHttpResponse(StatusCode.SERVER_ERROR, "ProductID is not defined");
    };

    const params = {
        TableName: DB_PRODUCTS,
        Key: {
            id: { S: event.pathParameters.productId }
        },
    };

    try {
        const product = await dynamoDBClient.send(new GetItemCommand(params));
        if (!product.Item) {
            return generateHttpResponse(StatusCode.NOT_FOUND, "Product not found");
        };
        console.log("Product:", product.Item);

        return generateHttpResponse(StatusCode.OK, unmarshall(product.Item));
    } catch (err) {
        if (err instanceof Error) {
            return generateHttpResponse(StatusCode.SERVER_ERROR, { message: err.message });
        };
    };
};
