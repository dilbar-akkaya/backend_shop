import { getProductsList } from "./handler";
import { StatusCode } from "../../types/http";

const data = [
    {
        "id": "1",
        "title": "JavaScript: The Good Parts: The Good Parts",
        "price": 30,
        "description": "With JavaScript: The Good Parts, you'll discover a beautiful, elegant, lightweight and highly expressive language that lets you create effective code, whether you're managing object libraries or just trying to get Ajax to run fast. If you develop sites or applications for the Web, this book is an absolute must"
    },
    {
        "id": "2",
        "title": "Effective JavaScript: 68 Specific Ways to Harness the Power of JavaScript",
        "price": 22,
        "description": "Effective JavaScript is organized around 68 proven approaches for writing better JavaScript, backed by concrete examples. You’ll learn how to choose the right programming style for each project, manage unanticipated problems, and work more successfully with every facet of JavaScript programming from data structures to concurrency"
    },
    {
        "id": "3",
        "title": "JavaScript: The Definitive Guide",
        "price": 40,
        "description": "This Fifth Edition is completely revised and expanded to cover JavaScript as it is used in today's Web 2.0 applications. This book is both an example-driven programmer's guide and a keep-on-your-desk reference, with new chapters that explain everything you need to know to get the most out of JavaScript"
    }];

describe("getProducts function", () => {

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