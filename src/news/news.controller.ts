import { Body, Controller, Get, NotFoundException, Post, Query, Req } from '@nestjs/common';
import { NewsService } from './news.service';
import { FilterBy } from 'src/models/filterBy.interface';

@Controller('news/')
export class NewsController {
    constructor(private newsService: NewsService) { }

    @Post('save')
    async addArticles(
        @Body() requestBody: { filterBy: FilterBy, searchQuery: string, page: number }) {
        const { filterBy, searchQuery, page } = requestBody;
        const reqQuery = this.newsService.buildApiRequestQuery(filterBy, searchQuery, 1)
        const headlines = await this.newsService.fetchArticlesFromApiAndSaveToDb(reqQuery, filterBy, page)
        // console.log('headlines controller:', headlines)
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
        @Body() requestBody: { filterBy: FilterBy, searchQuery: string, page: number }) {
        const { filterBy, searchQuery, page } = requestBody;
        try {
            const articles = await this.newsService.getFilteredArticlesFromDb(filterBy, searchQuery, page)
            // console.log('articles from controller:', articles)
            return articles
        } catch (err) {
            console.log('Failed querying articles', err)
            throw err
        }
    }
}




