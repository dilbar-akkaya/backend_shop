//import products from '../data.json';
import AWS from 'aws-sdk';
AWS.config.update({ region: 'eu-west-1' });
const dynClient = new AWS.DynamoDB.DocumentClient();
export const getProductsById = async (event) => {
  const params = {
    TableName: process.env.PRODUCTS_TABLE,
    Key: {
      id: event.pathParameters.productId,
    },
  };
  try {
    const product = await dynClient.get(params).promise();
    if (!product.Item) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: 'Product not found'
      }
    }
  
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(
        product.Item
      ),
    }
  } catch(err) {
    console.log(err)
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: 'Server error',
    };
  }
}