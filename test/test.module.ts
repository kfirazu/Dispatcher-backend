// app.test.module.ts
import { Module } from '@nestjs/common';
import { TestConfigModule } from './test.config.module';
import { NewsModule } from '../src/news/news.module';
import { AppModule } from '../src/app/app.module';

@Module({
    imports: [TestConfigModule, NewsModule, AppModule],
})
export class TestModule { }