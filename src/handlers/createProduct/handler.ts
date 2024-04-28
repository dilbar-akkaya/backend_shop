import { APIGatewayProxyEvent } from 'aws-lambda';
//import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { generateHttpResponse } from '../../utils/lambda';
import { StatusCode } from '../../types/types';
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "eu-west-1" })
);

//AWS.config.update({ region: 'eu-west-1' });
//const dynClient = new AWS.DynamoDB.DocumentClient();

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

        if (process.env.PRODUCTS_TABLE === undefined) {
            
            return generateHttpResponse(StatusCode.SERVER_ERROR, 'Something is wrong');
        };

  /*       const params = {
            TableName: process.env.PRODUCTS_TABLE,
            Item: newProduct,
        }; */

        await dynClient.send(new PutItemCommand({
            TableName: process.env.PRODUCTS_TABLE,
            Item: {
                id: { S: newProduct.id },
                title: { S: newProduct.title },
                description: { S: newProduct.description },
                price: { N: newProduct.price },
            }
        }));

        return generateHttpResponse(StatusCode.OK, newProduct);
    } catch (err) {

        if (err instanceof Error) {

            return generateHttpResponse(StatusCode.SERVER_ERROR, { message: err.message });
        };
    };
};
