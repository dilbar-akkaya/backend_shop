//import AWS from 'aws-sdk';
import { productsDB } from './productsForLoad';
import { stockDB } from './stockForLoad';
import { IProduct, IStock, StatusCode } from '../types/types';
import { generateHttpResponse } from '../utils/lambda';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const dynClient = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: "eu-west-1" })
  );
const loadProductsToDB = async (products: IProduct[]) => {

    if (process.env.PRODUCTS_TABLE === undefined) {

        return generateHttpResponse(StatusCode.SERVER_ERROR, 'Something is wrong');
    };
    for (const product of products) {
        const params = {
            TableName: process.env.PRODUCTS_TABLE,
            Item: product,
        };
        await dynClient.send(new PutCommand(params));

    }
};

const loadStockToDB = async (stock: IStock[]) => {

    if (process.env.STOCKS_TABLE === undefined) {

        return generateHttpResponse(StatusCode.SERVER_ERROR, 'Something is wrong');
    };
    for (const item of stock) {
        const params = {
            TableName: process.env.STOCKS_TABLE,
            Item: item,
        };
        await dynClient.send(new PutCommand(params));
    }
};

loadProductsToDB(productsDB);
loadStockToDB(stockDB);