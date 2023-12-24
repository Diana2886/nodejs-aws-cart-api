import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import helmet from 'helmet';
import { Handler, Context, Callback } from 'aws-lambda';
import { AppModule } from './app.module';

// const port = process.env.PORT || 4000;

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule, { logger: ['error'] });
  await app.init();

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  // await app.listen(port);

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}
// bootstrap().then(() => {
//   console.log('App is running on %s port', port);
// });

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  try {
    server = server ?? (await bootstrap());
  } catch (err) {
    console.log('Error:', err)
  }
  return server(event, context, callback);
};
