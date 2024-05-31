const serverlessConfiguration = {
    service: 'import-service',
    provider: {
      name: 'aws',
      runtime: 'nodejs20.x',
      stage: 'dev',
      region: 'eu-west-1',
      environment: {
        PRODUCTS_TABLE: 'Products',
        STOCK_TABLE: 'Stock',
        ACCOUNT_ID: '${aws:accountId}',
        REGION: '${aws:region}',
        BUCKET: 'import-service-csv',
        QUEUE_URL: {
          'Fn::Join': [
              '', [
              'https://sqs.',
              { 'Fn::Sub': '${AWS::Region}' },
              '.amazonaws.com/',
              { 'Fn::Sub': '${AWS::AccountId}' },
              '/catalogItemsQueue'
              ]
          ]
      },
      },
      iamRoleStatements: [
        {
          Effect: "Allow",
          Action: ["lambda:InvokeFunction"],
          Resource: [
            {"Fn::Sub":"arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:authorization-service-dev-basicAuthorizer"},
          ],
        },
        {
          Effect: 'Allow',
          Action: ['sqs:ReceiveMessage', 'sqs:SendMessage'],
          Resource: {"Fn::Sub":'arn:aws:sqs:${AWS::Region}:${AWS::AccountId}:catalogItemsQueue'}
        },
        {
          Effect: 'Allow',
          Action: [
            's3:PutObject',
            's3:GetObject',
            's3:ListObject',
            's3:DeleteObject',
            's3:PutObjectAcl',
          ],
          Resource: [
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
        tsconfig: 'tsconfig.json',
        platform: 'node',
    },
},
    functions: {
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
                authorizer: {
                  name: "basicAuthorizer",
                  arn: "arn:aws:lambda:${self:provider.region}:${self:provider.environment.ACCOUNT_ID}:function:authorization-service-dev-basicAuthorizer",
                  type: "token",
                  identitySource: "method.request.header.Authorization",
                  resultTtlInSeconds: 0
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