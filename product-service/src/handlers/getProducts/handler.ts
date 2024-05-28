import { StatusCode } from "../../types/http";
import { generateHttpResponse } from "../../utils/lambda";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DB_PRODUCTS, DB_STOCKS, REGION } from "../../constants";

const dynamoDBClient = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: REGION })
);

export const getProductsList = async () => {
    const productsScan = new ScanCommand({ TableName: DB_PRODUCTS });
    const stockScan = new ScanCommand({ TableName: DB_STOCKS });
    const products = await dynamoDBClient.send(productsScan);
    const stock = await dynamoDBClient.send(stockScan);

    try {
        if (!products.Items) {
            return generateHttpResponse(StatusCode.NOT_FOUND, "Product not found");
        };

        const unmarshalledProducts = products.Items.map((item) => unmarshall(item));
        const productsArray = unmarshalledProducts.map(product => {

            if (!stock.Items) {
                return generateHttpResponse(StatusCode.NOT_FOUND, "Product not found");
            };

            const unmarshalledProductInStock = stock.Items.map((item) => unmarshall(item));
            const productInStock = unmarshalledProductInStock.find(stock => {
      
                return stock.product_id === product.id;
            });

            return {
                ...product,
                count: productInStock ? productInStock.count : 0,
            };
        });
        console.log("List of products:", productsArray);
    
        return generateHttpResponse(StatusCode.OK, productsArray);
    } catch (err) {

        if (err instanceof Error) {
            return generateHttpResponse(StatusCode.SERVER_ERROR, { message: err.message });
        };
    };
};
