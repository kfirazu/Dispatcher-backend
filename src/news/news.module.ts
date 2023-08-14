import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { Article, ArticleSchema } from './article.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsRepository } from './news.repository';
import { MongooseConnectionModule } from 'src/app/mongoose-connection.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }])],
  controllers: [NewsController],
  providers: [NewsService, NewsRepository]
})
export class NewsModule { }
