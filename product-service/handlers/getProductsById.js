import products from '../data.json'
export const getProductsById = async (event) => {
  const product = products.find(product => product.id === event.pathParameters.productId)
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