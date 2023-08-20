import { Injectable } from '@nestjs/common';
import { NewsRepository } from './news.repository';
import axios, { AxiosRequestConfig } from 'axios';
import { FilterBy } from 'src/models/filter-by.interface';
import { EndpointOption, FilterOptions } from 'src/models/filter-options.interface';
require('dotenv').config()

const API_KEY = process.env.NEWS_API_KEY
const BASE_URL = `https://newsapi.org/v2/`


const config: AxiosRequestConfig = {
    headers: { Authorization: `Bearer ${API_KEY}` }
}

@Injectable()
export class NewsService {

    constructor(private readonly newsRepository: NewsRepository) { }

    async fetchArticlesFromApiAndSaveToDb(reqQuery: string, filterBy: FilterBy, page: number) {

        const encodedQuery = encodeURI(reqQuery)
        //FIX: Couldnt get the response through authorization header

        const res = await axios.get(encodedQuery, config);
        res.data.page = page
        // return response to repository
        if (res.data && res.data.articles && res.data.articles.length > 0) {
            const articlesToSave = res.data.articles.map(articleData => {
                const tags = Object.values(filterBy).filter(value => typeof value === 'string' && value !== '')
                const type = filterBy.type // Set the type property
                const article = {
                    ...articleData,
                    type,
                    tags,
                }
                return article
            })
            await this.newsRepository.saveArticlesToDb(articlesToSave);
        }
    }

    async getAllDataFromDb() {
        return await this.newsRepository.getAllData()
    }

    async getFilteredArticlesFromDb(filterBy: FilterBy, searchQuery: string, page: number) {
        const query = this.buildDbQueryFromFilter(filterBy, searchQuery)
        const articles = await this.newsRepository.getFilteredArticles(query, searchQuery, page)
        return articles
    }

    private buildDbQueryFromFilter(filterBy: FilterBy, searchQuery: string) {
        const query: any = [];

        if (filterBy.type) {
            query.push(filterBy.type)
        }

        if (filterBy.source) {
            query.push(filterBy.source)
        }

        if (filterBy.category) {
            query.push(filterBy.category)
        }

        if (filterBy.country) {
            query.push(filterBy.country)
        }

        if (filterBy.language) {
            query.push(filterBy.language)
        }

        if (filterBy.sortBy) {
            query.push(filterBy.sortBy)
        }

        // if (filterBy.dates && (filterBy.dates.from || filterBy.dates.to)) {
        //     query.dates.push(filterBy.dates.from)
        //     query.dates.push(filterBy.dates.to)
        // }
        if (searchQuery && searchQuery.length > 0) {
            query.searchQuery = searchQuery
        }
        console.log('query:', query)
        return query
    }

    buildApiRequestQuery(filterBy: FilterBy, searchQuery: string, page: number) {
        const { country, source, category, type, language, sortBy, dates } = filterBy
        // Build url request string to send to api
        let reqQuery = BASE_URL

        type?.toLowerCase() === FilterOptions.EVERYTHING
            ? reqQuery += EndpointOption.EVERYTHING
            : reqQuery += EndpointOption.TOP_HEADLINES

        if (country !== '') {
            reqQuery += `country=${country}&`
        }
        if (category !== '') {
            reqQuery += `category=${category}&`
        }
        if (source !== '') {
            reqQuery += `sources=${source}&`
        }
        if (language !== '') {
            reqQuery += `language=${language}&`
        }
        if (sortBy !== '') {
            reqQuery += `sortBy=${sortBy}&`
        }
        if (searchQuery) {
            reqQuery += `q=${searchQuery}&`
        }
        // if (dates.from !== '' && dates.to !== '') {
        //     reqQuery += `from=${dates.from}&to=${dates.to}&`
        // }
        if (page) {
            reqQuery += `page=${page}`
        }
        if (
            reqQuery.startsWith(BASE_URL) &&
            (reqQuery.includes('country=') ||
                reqQuery.includes('category=') ||
                reqQuery.includes('sources=') ||
                reqQuery.includes('language=') ||
                reqQuery.includes('sortBy=') ||
                reqQuery.includes('q='))
        ) {

            // reqQuery += PAGE_SIZE

            return reqQuery

        }
    }

}