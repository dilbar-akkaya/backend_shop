//import products from '../data.json';
import AWS from 'aws-sdk';
AWS.config.update({ region: 'eu-west-1' });
const dynClient = new AWS.DynamoDB.DocumentClient();

export const getProductsList = async () => {
  const products = await dynClient.scan({ TableName: process.env.PRODUCTS_TABLE }).promise();
  const stock = await dynClient.scan({ TableName: process.env.STOCK_TABLE }).promise();
  try {
    const productsArray = products.Items.map(product => {
      const productInStock = stock.Items.find(stock => stock.product_id === product.id);
      return {
        ...product,
        count: productInStock ? productInStock.count : 0,
      };
    });
    console.log("products:", productsArray);
      return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(
        productsArray
      ),
    };
  } catch (err) {
    return { message: err.message }
  }
};
