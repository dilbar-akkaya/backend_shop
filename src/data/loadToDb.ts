import { productsDB } from './productsForLoad';
import { stockDB } from './stockForLoad';
import { IProduct, IStock } from '../types/products';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DB_PRODUCTS, DB_STOCKS, REGION } from '../constants';

const dynamoDBClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: REGION })
);

const loadProductsToDB = async (products: IProduct[]) => {
/*   if (DB_PRODUCTS === '') {
    throw new Error('PRODUCTS_TABLE is not defined');
  }; */
 
  for (const product of products) {
    const params = {
      TableName: DB_PRODUCTS,
      Item: product,
    };
    await dynamoDBClient.send(new PutCommand(params));
  }
};

const loadStockToDB = async (stock: IStock[]) => {
/*   if (DB_STOCKS === '') {
    throw new Error('STOCKS_TABLE is not defined');
  }; */

  for (const item of stock) {
    const params = {
      TableName: DB_STOCKS,
      Item: item,
    };
    await dynamoDBClient.send(new PutCommand(params));
  }
};

loadProductsToDB(productsDB);
loadStockToDB(stockDB);