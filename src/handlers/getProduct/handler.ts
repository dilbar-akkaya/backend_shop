import { APIGatewayProxyEvent } from "aws-lambda";
import { generateHttpResponse } from "../../utils/lambda";
import { StatusCode } from "../../types/types";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "eu-west-1" })
);

export const getProductsById = async (event: APIGatewayProxyEvent) => {
  console.log("Event:", event);

  if (event.pathParameters === null) {

    return generateHttpResponse(StatusCode.BAD_REQUEST, event.pathParameters);
  };

  if (process.env.PRODUCTS_TABLE === undefined || event.pathParameters.productId === undefined) {

    return generateHttpResponse(StatusCode.SERVER_ERROR, 'Something is wrong');
  };
  const params = {
    TableName: process.env.PRODUCTS_TABLE,
    Key: {
      id: { S: event.pathParameters.productId }
    },
  };
  try {
    const product = await dynClient.send(new GetItemCommand(params));

    if (!product.Item) {

      return generateHttpResponse(StatusCode.NOT_FOUND, 'Product not found');
    };
    console.log("Product:", product.Item);

    return generateHttpResponse(StatusCode.OK, unmarshall(product.Item));
  } catch (err) {

    if (err instanceof Error) {

      return generateHttpResponse(StatusCode.SERVER_ERROR, { message: err.message });
    };
  };
};
