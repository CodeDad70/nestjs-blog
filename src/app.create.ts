import { INestApplication, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk'

export function appCreate(app: INestApplication ): void {
    app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Class')
    .setDescription('fun times !')
    .setVersion('1.0')
    .setTermsOfService('terms.url')
    .addTag('API')
    .addServer('http://localhost.3000')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  // Setup AWS sdk to upload image files to s3 bucket
  const configService = app.get(ConfigService);
  config.update({
    credentials: {
      accessKeyId: configService.get('appConfig.awsAccessKeyId') ?? '',
      secretAccessKey: configService.get('appConfig.awsSecretAccessKey') ?? '',
    },
    region: configService.get('appConfig.awsRegion'),
  })

  //enable cors
  app.enableCors();
}