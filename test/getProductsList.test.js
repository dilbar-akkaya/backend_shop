import { getProductsList } from '../product-service/handlers/getProductsList';
import data from '../product-service/data.json';

test('getProductsList returns response', async () => {
    const response = await getProductsList();
    expect(response).toEqual({
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
          },
        body: JSON.stringify(
            data
          ),
    });
});