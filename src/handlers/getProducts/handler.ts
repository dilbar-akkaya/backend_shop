import products from "../../data/data.json";
import { StatusCode } from "../../types/types";
import { generateHttpResponse } from "../../utils/lambda";

export const getProductsList = async () => {
  try {
  
    return generateHttpResponse(StatusCode.OK, products);
  } catch (err) {
    
    if (err instanceof Error) {

      return generateHttpResponse(StatusCode.SERVER_ERROR, { message: err.message });
    }
  }
};
