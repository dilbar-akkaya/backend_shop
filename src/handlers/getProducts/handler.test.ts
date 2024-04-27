import { getProductsList } from "./handler";
import data from "../../data/data.json";
import { StatusCode } from "../../types/types";

describe('getProducts function', () => {

  it("should return response with status code 200, body with list of products, and headers", async () => {

    const response = await getProductsList();
    const equledData = {
      statusCode: StatusCode.OK,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    };
    expect(response).toEqual(equledData);
  });
});