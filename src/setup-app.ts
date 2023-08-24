import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const setupApp = (app: any) => {
    const config = new DocumentBuilder()
        .setTitle('Dispatcher')
        .setDescription('The dispatcher API description')
        .setVersion('1.0')
        .addTag('News')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true
        }),
    );

}
