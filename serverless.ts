const serverlessConfiguration = {
    service: "product-service",
    provider: {
      name: 'aws',
      runtime: 'nodejs20.x',
      stage: 'dev',
      region: 'eu-west-1',
    },
    plugins: [
      'serverless-offline',
      'serverless-webpack'
  ],
    functions: {
        getProductsList: {
          handler: 'src/handlers/getProducts/handler.getProductsList',
          events: [
            {
              http: {
                path: '/products',
                method: 'get',
                cors: {
                  origin: '*',
                  headers: [
                    'Content-Type',
                    'X-Amz-Date',
                    'Authorization',
                    'X-Api-Key',
                    'X-Amz-Security-Token',
                    'X-Amz-User-Agent'
                  ],
                  allowCredentials: false,
                }
              }
            }
          ],
        },
        getProductsById: {
          handler: 'src/handlers/getProduct/handler.getProductsById',
          events: [
            {
              http: {
                method: 'get',
                path: '/products/{productId}',
                cors: {
                  origin: '*',
                  headers: [
                    'Content-Type',
                    'X-Amz-Date',
                    'Authorization',
                    'X-Api-Key',
                    'X-Amz-Security-Token',
                    'X-Amz-User-Agent'
                  ],
                  allowCredentials: false,
                }
              },
            },
          ],
        },
      },
  };
  
  module.exports = serverlessConfiguration;