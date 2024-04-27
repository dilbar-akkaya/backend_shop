import products from "../../data/data.json";
import { APIGatewayProxyEvent } from "aws-lambda";
import { generateHttpResponse } from "../../utils/lambda";
import { StatusCode } from "../../types/types";

export const getProductsById = async (event: APIGatewayProxyEvent) => {

  const productId = event.pathParameters?.productId;

  if (!productId) {

    return generateHttpResponse(StatusCode.BAD_REQUEST, "ProductId dosnt exist");
  };

  const product = products.find((product) => product.id === productId);

  if (!product) {

    return generateHttpResponse(StatusCode.NOT_FOUND, "Product not found");
  };

  return generateHttpResponse(StatusCode.OK, product);
};
