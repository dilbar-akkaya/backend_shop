import { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { generateHttpResponse } from '../../utils/lambda';
import { StatusCode } from '../../types/http';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { z } from 'zod';
import { REGION } from '../../constants';

const dynamoDBClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: REGION })
);

const newProductSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  count: z.number(),
});

export const createProduct = async (event: APIGatewayProxyEvent) => {
  try {
    if (!event.body) {
      return generateHttpResponse(StatusCode.BAD_REQUEST, 'Body is missing');
    };

    const validBody = newProductSchema.safeParse(JSON.parse(event.body));

    if (!validBody.success) {
      return generateHttpResponse(StatusCode.BAD_REQUEST, 'Invalid data');
    };

    const newProduct = {
      id: uuidv4(),
      title: validBody.data.title,
      description: validBody.data.description,
      price: validBody.data.price,
    };
    const stockForNewProduct = {
      product_id: newProduct.id,
      count: validBody.data.count,
    };
    
    await dynamoDBClient.send(new TransactWriteCommand({
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
