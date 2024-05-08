const serverlessConfiguration = {
    service: 'product-service',
    provider: {
      name: 'aws',
      runtime: 'nodejs20.x',
      stage: 'dev',
      region: 'eu-west-1',
      environment: {
        PRODUCTS_TABLE: 'Products',
        STOCK_TABLE: 'Stock',
        REGION: 'eu-west-1',
        BUCKET: 'import-service-csv',
      },
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: [
            'dynamodb:Scan',
            'dynamodb:GetItem',
            'dynamodb:PutItem',
            'dynamodb:UpdateItem',
            'dynamodb:DeleteItem',
            's3:PutObject',
            's3:GetObject',
            's3:ListObject',
            's3:DeleteObject',
            's3:PutObjectAcl',
          ],
          Resource: [
            'arn:aws:dynamodb:${self:provider.region}:*:table/Products',
            'arn:aws:dynamodb:${self:provider.region}:*:table/Stock',
            'arn:aws:s3:::${self:provider.environment.BUCKET}/*'
          ],
        },
      ],
    },
    plugins: [
      'serverless-offline',
      'serverless-esbuild'
  ],
  custom: {
    esbuild: {
        bundle: true,
        minify: true,
        sourcemap: true,
        keepNames: true,
        tsconfig: './tsconfig.json',
        platform: 'node',
    },
},
    functions: {
      createProduct: {
        handler: 'src/handlers/createProduct/handler.createProduct',
        events: [
          {
           http: {
             path: '/products',
             method: 'post',
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
            },
           },
          },
        ],
      },
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
          events:  [
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
        importProductsFile: {
          handler: 'src/handlers/importProductsFile/handler.importProductsFile',
          events: [
            {
              http: {
                path: '/import',
                method: 'get',
                request: {
                  parameters: {
                    querystrings: {
                      name: true
                    }
                  },
                },
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
        importFileParser: {
          handler: 'src/handlers/importFileParser/handler.importFileParser',
          events: [{
            s3: {
              bucket: '${self:provider.environment.BUCKET}',
              event: 's3:ObjectCreated:*',
              rules: [
                { prefix: 'uploaded/' },
                { suffix: '.csv' }
              ],
            }
          }],
        },
      },
  };
  
module.exports = serverlessConfiguration;