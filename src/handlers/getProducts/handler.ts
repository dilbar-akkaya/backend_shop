import { StatusCode } from "../../types/types";
import { generateHttpResponse } from '../../utils/lambda';
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "eu-west-1" })
);

export const getProductsList = async () => {

  if (process.env.PRODUCTS_TABLE === undefined || process.env.STOCK_TABLE === undefined) {

    return generateHttpResponse(StatusCode.SERVER_ERROR, 'Something is wrong');
  };

  const productsScan = new ScanCommand({ TableName: process.env.PRODUCTS_TABLE });
  const stockScan = new ScanCommand({ TableName: process.env.STOCK_TABLE });
  const products = await dynClient.send(productsScan);
  const stock = await dynClient.send(stockScan);
  try {

    if (products.Items === undefined) {

      return generateHttpResponse(StatusCode.NOT_FOUND, 'Product not found');
    };
    const unmarshalledProducts = products.Items.map((item) => unmarshall(item));
    const productsArray = unmarshalledProducts.map(product => {

      if (stock.Items === undefined) {

        return generateHttpResponse(StatusCode.NOT_FOUND, 'Product not found');
      };
      const unmarshalledProductInStock = stock.Items.map((item) => unmarshall(item));
      const productInStock = unmarshalledProductInStock.find(stock => {
      
        return stock.product_id === product.id;

      });

      return {
        ...product,
        count: productInStock ? productInStock.count : 0,
      };
    });

    console.log("List of products:", productsArray);
    
    return generateHttpResponse(StatusCode.OK, productsArray);
  } catch (err) {

    if (err instanceof Error) {

      return generateHttpResponse(StatusCode.SERVER_ERROR, { message: err.message });
    };
  };
};
