// app.test.module.ts
import { Module } from '@nestjs/common';
import { TestConfigModule } from './test.config.module';
import { NewsModule } from '../src/news/news.module';
import { AppModule } from '../src/app/app.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env.test',
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('TEST_DB_URL'),
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }),
            inject: [ConfigService],
        }),
        NewsModule,
        ScheduleModule.forRoot()
    ],

})
export class TestModule { }