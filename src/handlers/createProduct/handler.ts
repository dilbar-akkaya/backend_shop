import { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { generateHttpResponse } from '../../utils/lambda';
import { StatusCode } from '../../types/types';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";

const dynClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "eu-west-1" })
);

export const createProduct = async (event: APIGatewayProxyEvent) => {
    try {

        if (event.body === null) {

            return generateHttpResponse(StatusCode.BAD_REQUEST, event.body);
        };

        const parsedBody = JSON.parse(event.body);
        const newProduct = {
            id: uuidv4(),
            title: parsedBody.title,
            description: parsedBody.description,
            price: parsedBody.price,
        };
        const stockForNewProduct = {
              product_id: newProduct.id,
              count: parsedBody.count,
          };

        if (process.env.PRODUCTS_TABLE === undefined) {
            
            return generateHttpResponse(StatusCode.SERVER_ERROR, 'Something is wrong');
        };

        await dynClient.send(new TransactWriteCommand({
            TransactItems: [
                { Put: {
                    TableName: process.env.PRODUCTS_TABLE,
                    Item: {
                        id: newProduct.id,
                        title: newProduct.title,
                        description: newProduct.description,
                        price: newProduct.price,
                    }
                } },
                { Put: {
                    TableName: process.env.STOCK_TABLE,
                    Item: {
                        product_id: stockForNewProduct.product_id,
                        count: stockForNewProduct.count,
                    }
                } }
            ]
        }));
        console.log("newProduct:", newProduct);

        return generateHttpResponse(StatusCode.OK, { message: 'Product succesfully created', data: newProduct});
    } catch (err) {

        if (err instanceof Error) {

            return generateHttpResponse(StatusCode.SERVER_ERROR, { message: err.message });
        };
    };
};
