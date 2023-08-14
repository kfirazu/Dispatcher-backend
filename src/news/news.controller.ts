import { Controller, Get } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
    constructor(private newsService: NewsService) { }

    // @Get('/')
    // getArticles(filterBy, searchTerm, page) {

    // }

    @Get('/')
    async getArticles() {
        const headlines = await this.newsService.query('filterBy', 'SearchTrem', 1)
        // console.log('headlines controller:', headlines)
    }
}




