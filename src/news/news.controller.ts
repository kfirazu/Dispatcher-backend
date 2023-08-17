import { Body, Controller, Get, NotFoundException, Post, Query, Req } from '@nestjs/common';
import { NewsService } from './news.service';
import { FilterBy } from 'src/models/filter-by.interface';
import { SearchArticlesDto } from './dtos/search-articles.dto';

@Controller('news/')
export class NewsController {
    constructor(private newsService: NewsService) { }

    @Post('save')
    async addArticles(
        @Body() requestBody: SearchArticlesDto) {
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
            return []
        }
        console.log('articles from controller:', articles)
        return articles
    }

    @Post('articles')
    async getFilteredData(
        @Body() requestBody: SearchArticlesDto) {
        const { filterBy, searchQuery, page } = requestBody
        const articles = await this.newsService.getFilteredArticlesFromDb(filterBy, searchQuery, page)
        if (!articles) {
            return []
        }
        return articles

    }
}




