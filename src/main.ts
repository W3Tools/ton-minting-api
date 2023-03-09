import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';
import { json, urlencoded } from 'express';
import { appConfig } from './lib/configs/app.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        // running log, production: not doing anything, dev: set NODE_ENV="dev"
        logger: !appConfig.global.debug ? false : ['log', 'error', 'warn', 'debug', 'verbose'],
    });

    // configure: base route frefix
    app.setGlobalPrefix(appConfig.global.prefix, { exclude: [{ path: 'health', method: RequestMethod.GET }] });

    // configure: cros
    app.enableCors();

    app.use(json({ limit: '100mb' }));

    // configure: param validator, controlled by dto's decorator
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        })
    );

    // configure: swagger
    if (appConfig.global.debug) {
        var config = new DocumentBuilder();
        config.setTitle(appConfig.swagger.title); // swagger title
        config.setDescription(appConfig.swagger.description); // swagger description
        config.setVersion(appConfig.swagger.version); // swagger version
        // configure: swagger session -> header.session
        config.addApiKey(
            {
                name: 'session',
                type: 'apiKey',
                in: 'header',
            },
            'session'
        );
        const cfg = config.build();
        const document = SwaggerModule.createDocument(app, cfg);
        SwaggerModule.setup(appConfig.swagger.route, app, document);
    }

    // listen server
    await app.listen(appConfig.global.port);
    // print some log
    console.log(`Server Starting on http://localhost:${appConfig.global.port}`);
    appConfig.global.debug ? console.log(`Swagger Starting on http://localhost:${appConfig.global.port}/${appConfig.swagger.route}`) : '';
    appConfig.global.debug ? console.log(`GraphQL Starting on http://localhost:${appConfig.global.port}/graphql`) : '';
}

bootstrap();
