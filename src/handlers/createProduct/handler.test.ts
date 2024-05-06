
process.env.PRODUCTS_TABLE = 'Products';
process.env.STOCK_TABLE = 'Stocks';
import { createProduct } from './handler';

//import { v4 as uuidv4 } from 'uuid';
/* 
jest.mock('@aws-sdk/lib-dynamodb', () => {
    const mockSend = jest.fn();
  
    return {
      DynamoDBDocumentClient: {
        from: jest.fn().mockReturnValue({
          send: mockSend,
        }),
      },
      TransactWriteCommand: jest.fn(),
    };
  });
  
describe("createProduct", () => { 
  it("should create a new product", async () => {
    const newProduct = {
      title: "Mock Product",
      description: "Mock Description",
      price: 100,
      count: 1
    };
    const event = {
      body: JSON.stringify(newProduct),
      headers: {},
      multiValueHeaders: {},
      httpMethod: "POST",
      isBase64Encoded: false,
      path: "/",
      pathParameters: { productId: "1" },
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
      requestContext: {
        accountId: "",
        apiId: "",
        authorizer: null,
        protocol: "",
        httpMethod: "",
        identity: {
          accessKey: null,
          accountId: null,
          apiKey: null,
          apiKeyId: null,
          caller: null,
          clientCert: null,
          cognitoAuthenticationProvider: null,
          cognitoAuthenticationType: null,
          cognitoIdentityId: null,
          cognitoIdentityPoolId: null,
          principalOrgId: null,
          sourceIp: "",
          user: null,
          userAgent: null,
          userArn: null,
        },
        path: "",
        stage: "",
        requestId: "",
        resourceId: "",
        resourcePath: "",
        requestTimeEpoch: 0,
      },
      resource: "",
    };
    await createProduct(event);

    expect(mockSend).toHaveBeenCalled();
    expect(mockSend).toHaveBeenCalledWith(expect.anything());
  });
}); */

import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';
import { AWSError } from 'aws-sdk/global';
import { DocumentClient, TransactWriteItemsInput } from 'aws-sdk/clients/dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';

AWSMock.setSDKInstance(AWS);

describe('createProduct', () => {

  beforeEach(() => {
    AWSMock.mock('DynamoDB.DocumentClient', 'transactWrite', 
      (params: TransactWriteItemsInput, callback: (err: AWSError, data: DocumentClient.TransactWriteItemsOutput) => void) => 
      {
        callback(undefined as unknown as AWSError, { ConsumedCapacity: []});
      }
    );
  });

  afterEach(() => {
    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('should call DynamoDB with correct params', async () => {
    const mockEvent: APIGatewayProxyEvent = {
      body: JSON.stringify({
        title: 'test title',
        description: 'test description',
        price: 123,
        count: 1,
      }),
    } as unknown as APIGatewayProxyEvent;

    const result = await createProduct(mockEvent);
    const expectedResult = {
      statusCode: 200, 
      body: JSON.stringify({
        message: 'Product succesfully created',
        data: {
          title: 'test title',
          description: 'test description',
          price: 123,
          count: 1,
        },
      }),
    };
    
    expect(result).toEqual(expectedResult);
  });
});