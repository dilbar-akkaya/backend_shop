import products from '../data.json';
import { APIGatewayProxyEvent } from 'aws-lambda';
export const getProductsById = async (event: APIGatewayProxyEvent) => {
  const productId = event.pathParameters?.productId;
  if (!productId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'ProductId dosnt exist' })
    };
  }
  const product = products.find(product => product.id === productId)
  console.log(event)
  if (!product) {
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
      product
    ),
  }
}