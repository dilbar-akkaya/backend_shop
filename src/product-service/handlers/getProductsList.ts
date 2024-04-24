import products from "../data.json";

export const getProductsList = async () => {

  try {

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(products),
    };
    
  } catch (err) {

    if (err instanceof Error) {
      
      return { message: err.message };
    }
  }
};
