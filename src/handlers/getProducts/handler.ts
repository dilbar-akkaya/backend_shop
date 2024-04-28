import { StatusCode } from "../../types/types";
import { generateHttpResponse } from "../../utils/lambda";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "eu-west-1" })
);

export const getProductsList = async () => {

  if (process.env.PRODUCTS_TABLE === undefined || process.env.STOCK_TABLE === undefined) {

    return generateHttpResponse(StatusCode.SERVER_ERROR, 'Something is wrong');
  };

  const productsCommand = new ScanCommand({ TableName: process.env.PRODUCTS_TABLE });
  const stockCommand = new ScanCommand({ TableName: process.env.STOCK_TABLE });

  const products = await dynClient.send(productsCommand);
  const stock = await dynClient.send(stockCommand);
  try {

    if (products.Items === undefined) {

      return generateHttpResponse(StatusCode.NOT_FOUND, 'Product not found');
    };
    const productsArray = products.Items.map(product => {

      if (stock.Items === undefined) {

        return generateHttpResponse(StatusCode.NOT_FOUND, 'Product not found');
      };

      const productInStock = stock.Items.find(stock => stock.product_id === product.id);

      return {
        ...product,
        count: productInStock ? productInStock.count : 0,
      };
    });

    return generateHttpResponse(StatusCode.OK, productsArray);
  } catch (err) {

    if (err instanceof Error) {

      return generateHttpResponse(StatusCode.SERVER_ERROR, { message: err.message });
    };
  };
};
