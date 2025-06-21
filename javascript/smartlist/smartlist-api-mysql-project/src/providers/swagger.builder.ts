import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerBuilder {
  static build(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('API Docs')
      .setDescription(
        `Welcome to the documentation for the APIs that are built for the SMARTLIST application.
         The APIs for each module are grouped by the module name.`,
      )
      .setVersion('0.1')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
}
