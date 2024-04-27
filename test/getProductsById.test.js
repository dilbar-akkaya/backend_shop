import { getProductsById } from '../product-service/handlers/getProductsById';

test('getProductsById with productId 1 returns frist obj from data.json with id 1 ', async () => {
  const event = {
    pathParameters: { productId: "1" }
  };
  const response = await getProductsById(event);
  expect(JSON.parse(response.body)).toEqual({
    "id": "1",
    "title": "JavaScript: The Good Parts: The Good Parts",
    "price": 30,
    "description": "With JavaScript: The Good Parts, you'll discover a beautiful, elegant, lightweight and highly expressive language that lets you create effective code, whether you're managing object libraries or just trying to get Ajax to run fast. If you develop sites or applications for the Web, this book is an absolute must"
  });
});