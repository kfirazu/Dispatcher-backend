import { Body, Controller, Get, NotFoundException, Post, Query, Req } from '@nestjs/common';
import { NewsService } from './news.service';
import { FilterBy } from 'src/models/filterBy.interface';
import { CreateArticleDto } from './dtos/create-article.dto';

@Controller('news/')
export class NewsController {
    constructor(private newsService: NewsService) { }

    @Post('save')
    async addArticles(
        @Body() requestBody: CreateArticleDto) {
        const filterBy: FilterBy = requestBody.filterBy
        const { searchQuery, page } = requestBody;
        const reqQuery = this.newsService.buildApiRequestQuery(filterBy, searchQuery, 1)
        await this.newsService.fetchArticlesFromApiAndSaveToDb(reqQuery, filterBy, page)

    }

    @Get()
    async getAllData() {
        // get all articles from db
        const articles = await this.newsService.getAllDataFromDb()
        if (!articles || !articles.length) {
            throw new NotFoundException('No articles found')
        }
        console.log('articles from controller:', articles)
        return articles
    }

    @Post('articles')
    async getFilteredData(
        @Body() requestBody: CreateArticleDto) {
        const { filterBy, searchQuery, page } = requestBody;
        try {
            const articles = await this.newsService.getFilteredArticlesFromDb(filterBy, searchQuery, page)
            if (!articles) {
                throw new NotFoundException('No articles were found')
            }
            return articles
        } catch (err) {
            console.log('Failed querying articles', err)
            throw err
        }
    }
}




