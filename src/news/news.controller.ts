import { Controller, Get, NotFoundException } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
    constructor(private newsService: NewsService) { }

    // @Get('/')
    // getArticles(filterBy, searchTerm, page) {

    // }

    // @Get('/')
    // async getArticles() {
    //     const headlines = await this.newsService.query('filterBy', 'SearchTrem', 1)
    //     // console.log('headlines controller:', headlines)
    // }

    @Get()
    async getAllData(){
        console.log('Do i get into get all data?')
        const articles = await this.newsService.getAllData()
        if(!articles || !articles.length) {
            throw new NotFoundException('No articles found')
        }
        console.log('articles from controller:', articles)
        return articles
    }
}




