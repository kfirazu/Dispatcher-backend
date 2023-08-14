import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Article, ArticleDocument } from './article.schema';
import { NewsRepository } from './news.repository';
import axios from 'axios';
require('dotenv').config()

const API_KEY = process.env.NEWS_API_KEY

const config: { [key: string]: any } = {
    headers: {
        Authorization: `Bearer ${API_KEY}`
    },
}

@Injectable()
export class NewsService {

    constructor(private readonly newsRepository: NewsRepository) { }

    test() {

    }

    async query(filterBy, searchTerm, page) {
        console.log('Do i get into news service query?')
        // build the url string (as in frontend query)

        // create api call using axiosÇ
        const res = await axios.get(`https://newsapi.org/v2/top-headlines?category=business`, config)
        // console.log('res:', res)
        // return response to repository

        if (res.data && res.data.articles && res.data.articles.length > 0) {
            await this.newsRepository.saveArticlesToDb(res.data.articles);
        }
    }

}
