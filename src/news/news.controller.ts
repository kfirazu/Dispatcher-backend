import { Controller, Get } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
    constructor(private newsService: NewsService) { }
    @Get('test')
    test() {
        this.newsService.test(); // Call the test method of NewsService
        return 'Test executed in NewsController';
    }
}
