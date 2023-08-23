import { Body, Controller, Get, NotFoundException, Post, Query, Req } from '@nestjs/common';
import { NewsService } from './news.service';
import { FilterBy } from 'src/models/filter-by.interface';
import { SearchArticlesDto } from './dtos/search-articles.dto';
import { ApiTags, ApiBody, ApiCreatedResponse } from '@nestjs/swagger'
import { Article } from './article.schema';


@Controller('news/')
export class NewsController {
    constructor(private newsService: NewsService) { }

    @ApiTags('Fetch articles from api')
    @ApiBody({
        description: 'Fetch articles request body',
        type: SearchArticlesDto,
    })
    @Post('save')
    @ApiCreatedResponse({
        description: 'Fetching from Api succeeded',
        type: [Article],

      })
    async addArticles(
        @Body() requestBody: SearchArticlesDto) {
        const filterBy: FilterBy = requestBody.filterBy
        const { searchQuery, page } = requestBody;
        const reqQuery = this.newsService.buildApiRequestQuery(filterBy, searchQuery, 1)
        await this.newsService.fetchArticlesFromApiAndSaveToDb(reqQuery, filterBy, page)

    }

    @ApiTags('Get all data')
    @Get()
    @ApiCreatedResponse({
        description: 'Fetch all data from DB',
        type: [Article],

      })
    async getAllData() {
        // get all articles from db
        const articles = await this.newsService.getAllDataFromDb()
        if (!articles || !articles.length) {
            return []
        }
        console.log('articles from controller:', articles)
        return articles
    }

    @ApiTags('Fetch articles from DB')
    @Post('articles')
    @ApiCreatedResponse({
        description: 'Fetch filtered data from DB',
        type: [Article],

      })
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


 

