const serverlessConfigurationProductService = {
  service: 'product-service',
  provider: {
    name: 'aws',
    profile: 'aws_profile',
    runtime: 'nodejs20.x',
    stage: 'dev',
    region: 'eu-west-1',
    environment: {
      PRODUCTS_TABLE: 'Products',
      STOCK_TABLE: 'Stock',
      ACCOUNT_ID: '${aws:accountId}',
      REGION: '${aws:region}',
      SNS_ARN: {
        Ref: 'NewProductTopic'
      }
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['sqs:ReceiveMessage', 'sqs:DeleteMessage', 'sqs:GetQueueAttributes'],
        Resource: {
          "Fn::GetAtt": [
            "catalogItemsQueue",
            "Arn"
          ]
        },
      },
      {
        Effect: 'Allow',
        Action: ['sns:Publish'],
        Resource: {
          "Fn::Join": [":", ["arn:aws:sns", { "Ref": "AWS::Region" }, { "Ref": "AWS::AccountId" }, "createProductTopic"]]
         },
      },
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
        ],
      }
    ]
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
      tsconfig: 'tsconfig.json',
      platform: 'node',
    },
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue'
        }
      }, 
      NewProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic'
        }
      },
      NewProductSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: 'dilbar_akkaya@epam.com',
          Protocol: 'email',
          TopicArn: 
          {"Ref": "NewProductTopic"},
          FilterPolicy: { price: [{"numeric": ["=", 19]}] }
        }
      },
      AdditionalProductSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: 'dilbarmutavalova@gmail.com',
          Protocol: 'email',
          TopicArn: 
          {"Ref": "NewProductTopic"},
          FilterPolicy: { count: [{"numeric": ["=", 10]}] }
        }
      }
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
    catalogBatchProccess: {
      handler: 'src/handlers/catalogBatchProccess/handler.catalogBatchProccess',
      events: [
        {
          sqs: {
            arn:
            {
              "Fn::GetAtt": [
                "catalogItemsQueue",
                "Arn"
              ]
            },
            batchSize: 5
          },
        },
      ],
    }
  },
};

module.exports = serverlessConfigurationProductService;