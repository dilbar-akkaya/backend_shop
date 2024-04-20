import products from '../data.json'
export const getProductsList = async () => {
  try {
    console.log("products:", products)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(
        products
      ),
    };
  } catch (err) {
    return { message: err.message }
  }
};
