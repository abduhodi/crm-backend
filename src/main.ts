import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import * as bodyParser from 'body-parser';
console.log(bcrypt.hashSync('12345', 7));
async function run() {
  try {
    const port = process.env.PORT || 3003;

    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('CRM documentation')
      .setDescription('The CRM API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    app.enableCors({ origin: '*', credentials: true });
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(port, () =>
      console.log('Server is listening on port ', port),
    );
  } catch (error) {
    console.log(error);
  }
}
run();
