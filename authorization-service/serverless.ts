const serverlessConfiguration = {
    service: 'authorization-service',
    useDotenv: true,
    provider: {
      name: 'aws',
      runtime: 'nodejs20.x',
      stage: 'dev',
      region: 'eu-west-1',
      apiGateway: {
        minimumCompressionSize: 1024,
        shouldStartNameWithService: true,
      },
      environment: {
        REGION: 'eu-west-1',
      },
      iamRoleStatements: [
        {
          Effect: "Allow",
          Action:  "execute-api:Invoke",
          Resource: "*"
        },
      ],
    },
    resources: {
      Resources: {
        GatewayResponseAccessDenied: {
          Type: 'AWS::ApiGateway::GatewayResponse',
          Properties: {
            ResponseParameters: {
              'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
              'gatewayresponse.header.Access-Control-Allow-Headers':
                "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
            },
            ResponseType: 'ACCESS_DENIED',
            RestApiId: 'cruvka2bu8',
          },
        },
        GatewayResponseUnauthorized: {
          Type: 'AWS::ApiGateway::GatewayResponse',
          Properties: {
            ResponseParameters: {
              'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
              'gatewayresponse.header.Access-Control-Allow-Headers':
                "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
            },
            ResponseType: 'UNAUTHORIZED',
            RestApiId: 'cruvka2bu8',
          },
        },
      },
    },
    plugins: [
      'serverless-offline',
      'serverless-esbuild',
      'serverless-dotenv-plugin'

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
        basicAuthorizer: {
          handler: 'src/handlers/basicAuthorizer/handler.basicAuthorizer',
        },
      },
  };
  
module.exports = serverlessConfiguration;