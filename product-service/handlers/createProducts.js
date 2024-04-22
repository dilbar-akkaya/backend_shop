import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
AWS.config.update({ region: 'eu-west-1' });
const dynClient = new AWS.DynamoDB.DocumentClient();
const createProduct = async (event) => {
    try {
      const parsedBody = JSON.parse(event.body);
      const newProduct = {
        id: uuidv4(),
        title: parsedBody.title,
        description: parsedBody.description,
        price: parsedBody.price,
      }
      const params = {
        TableName: process.env.PRODUCTS_TABLE,
        Item: newProduct,
      };
      await dynClient.put(params).promise();
      return {
        statusCode: 200,
        headers: {
           'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(newProduct),
     };
    } catch (err) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: 'Creating product is failed',
        }
    }
}