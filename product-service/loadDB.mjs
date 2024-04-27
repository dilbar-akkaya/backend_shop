import AWS from 'aws-sdk';
import { productsDB } from './products.mjs';
import { stockDB } from './stock.mjs';

AWS.config.update({ region: 'eu-west-1' })
const dynClient = new AWS.DynamoDB.DocumentClient();

const loadProductsToDB = async (products) => {
  for (const product of products) {
    const params = {
      TableName: process.env.PRODUCTS_TABLE,
      Item: product,
    };
    await dynClient.put(params).promise();
    console.log('Loaded data')
  }
};

const loadStockToDB = async (stock) => {
  for (const item of stock) {
    const params = {
      TableName: process.env.STOCKS_TABLE,
      Item: item,
    };
    await dynClient.put(params).promise();
    console.log('Loaded data')
  }
};

loadProductsToDB(productsDB);
loadStockToDB(stockDB);