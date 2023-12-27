import * as cdk from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as apiGateway from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import 'dotenv/config';
import "reflect-metadata"

const app = new cdk.App();

const stack = new cdk.Stack(app, 'CartServiceStack', {
  env: { region: process.env.AWS_REGION! },
});

const cartService = new NodejsFunction(stack, 'cartServiceLambda', {
  runtime: Runtime.NODEJS_18_X,
  functionName: 'cartService',
  entry: 'dist/main.js',
  timeout: cdk.Duration.seconds(10),
  environment: {
    PG_HOST: process.env.PG_HOST!,
    PG_PORT: process.env.PG_PORT!,
    PG_DATABASE: process.env.PG_DATABASE!,
    PG_USERNAME: process.env.PG_USERNAME!,
    PG_PASSWORD: process.env.PG_PASSWORD!,
  },
  initialPolicy: [
    new PolicyStatement({
      actions: ['rds-db:connect', 'rds-db:executeStatement'],
      resources: ['*'],
    }),
  ],
  bundling: {
    externalModules: [
      'sqlite3',
      'pg-query-stream',
      'oracledb',
      'better-sqlite3',
      'tedious',
      'mysql',
      'mysql2',
      '@nestjs/microservices',
      '@nestjs/microservices/microservices-module',
      '@nestjs/websockets/socket-module',
    ],
  },
});

const api = new apiGateway.HttpApi(stack, 'CartApi', {
  corsPreflight: {
    allowHeaders: ['*'],
    allowOrigins: ['*'],
    allowMethods: [apiGateway.CorsHttpMethod.ANY],
  },
});

api.addRoutes({
  path: '/{proxy+}',
  methods: [apiGateway.HttpMethod.ANY],
  integration: new HttpLambdaIntegration('CartServiceIntegration', cartService),
});

new cdk.CfnOutput(stack, 'ApiUrl', {
  value: `${api.url}`,
});
