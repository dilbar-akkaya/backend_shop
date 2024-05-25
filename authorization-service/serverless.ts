const serverlessConfiguration = {
    service: 'authorization-service',
    provider: {
      name: 'aws',
      runtime: 'nodejs20.x',
      stage: 'dev',
      region: 'eu-west-1',
      environment: {
        REGION: 'eu-west-1',
        dilbarakkaya: 'TEST_PASSWORD'
      },
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
        basicAuthorizer: {
          handler: 'src/handlers/basicAuthorizer/handler.basicAuthorizer',
        },
      },
  };
  
module.exports = serverlessConfiguration;