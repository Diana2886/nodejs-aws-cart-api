import { Construct } from 'constructs';
import { Stack, StackProps, App } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apiGateway from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import 'dotenv/config';
import * as iam from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class CartApi extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sharedLambdaProps = {
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: {
        PG_HOST: process.env.PG_HOST!,
        PG_PORT: process.env.PG_PORT!,
        PG_DATABASE: process.env.PG_DATABASE!,
        PG_USERNAME: process.env.PG_USERNAME!,
        PG_PASSWORD: process.env.PG_PASSWORD!,
      },
    };

    const mainHandler = new lambda.Function(this, 'MainHandler', {
      ...sharedLambdaProps,
      handler: 'main.handler',
      code: lambda.Code.fromAsset('dist'),
    });

    const rdsCustomPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['rds-db:connect', 'rds-data:ExecuteSql', 'rds:*'],
      resources: ['*'],
    });
    mainHandler.addToRolePolicy(rdsCustomPolicy);

    // const invoke = new lambda.Function(this, "Invoke", {
    //   ...sharedLambdaProps,
    //   functionName: "invoke",
    //   handler: 'pg-client-lambda.handler',
    //   code: lambda.Code.fromAsset('dist'),
    //   // entry: "src/handlers/pg-client-lambda.ts",
    // });
    // invoke.addToRolePolicy(rdsCustomPolicy);

    const api = new apiGateway.HttpApi(this, 'CartApi', {
      corsPreflight: {
        allowHeaders: ['*'],
        allowOrigins: ['https://d2za0p8r8k37bf.cloudfront.net'],
        allowMethods: [apiGateway.CorsHttpMethod.ANY],
        allowCredentials: true,
      },
    });

    api.addRoutes({
      integration: new HttpLambdaIntegration('CartApiIntegration', mainHandler),
      path: '/',
      methods: [apiGateway.HttpMethod.ANY],
    });

    api.addRoutes({
      integration: new HttpLambdaIntegration('CartApiIntegration', mainHandler),
      path: '/{proxy+}',
      methods: [apiGateway.HttpMethod.ANY],
    });
  }
}

const app = new App();
new CartApi(app, 'CartApiStack', {
  env: { region: process.env.AWS_REGION },
});
