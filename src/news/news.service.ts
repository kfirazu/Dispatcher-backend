import { Injectable } from '@nestjs/common';
import { NewsRepository } from './news.repository';
import axios, { AxiosRequestConfig } from 'axios';
import { FilterBy } from 'src/models/filter-by.interface';
import { EndpointOption, FilterOptions } from '../models/filter-options.interface';
import { Cron } from '@nestjs/schedule';
require('dotenv').config()

const API_KEY = process.env.NEWS_API_KEY
const BASE_URL = `https://newsapi.org/v2/`


const config: AxiosRequestConfig = {
    headers: { Authorization: `Bearer ${API_KEY}` }
}

// export enum FilterOptions {
//     EVERYTHING = "everything",
//     TOP_HEADLINES = "top-headlines",
//     COUNTRY = "country",
//     CATEGORY = "category",
//     SOURCE = "source",
//     LANGUAGE = "language",

// }
// export enum EndpointOption {
//     EVERYTHING = "everything?",
//     TOP_HEADLINES = `top-headlines?`,

// }

// const searchInOptions = [FilterOptions.TOP_HEADLINES, FilterOptions.EVERYTHING]
// const countryHashMap = {
//     name: 'country',
//     value: ['us', 'au', 'br', 'cn', 'de', 'fr', 'hk', 'it', 'il', 'ng', 'ru', ' pl',
//         'za', 'gb', 'ae', 'ar', 'be', 'eg', 'hu', 'pt', 'sa', 'rs', 'th', 'tw'],
//     index: 0
// }

// const categoryHashMap = {
//     name: 'category',
//     value: ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'],
//     index: 0
// }

// const sourcesHashMap = {
//     name: 'sources',
//     value: ['abc-news', 'axios', 'bbc-news', 'bbc-sport', 'bild', 'bleacher-reoprt', 'bloomberg',
//         'cnn', 'cbs-news', 'espn', 'focus', 'fox-news', 'fox-sports', 'google-news', 'nbc',
//         'new-york-magazine', 'tech-crunch', 'tech-radar', 'the-jerusalem-post', 'the-verge',
//         'the-washington-post', 'the-wall-street-journal', 'usa-today', 'ynet', 'wired', 'time', 'the-washington-times'],
//     index: 0
// }

// let searchInIterationIdx = 0
// let useCountry = true

@Injectable()
export class NewsService {

    readonly searchInOptions = [FilterOptions.TOP_HEADLINES, FilterOptions.EVERYTHING];
    countryHashMap = {
        name: 'country',
        value: ['us', 'au', 'br', 'cn', 'de', 'fr', 'hk', 'it', 'il', 'ng', 'ru', ' pl',
            'za', 'gb', 'ae', 'ar', 'be', 'eg', 'hu', 'pt', 'sa', 'rs', 'th', 'tw'],
        index: 0
    };
    categoryHashMap = {
        name: 'category',
        value: ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'],
        index: 0
    };

    sourcesHashMap = {
        name: 'sources',
        value: ['abc-news', 'axios', 'bbc-news', 'bbc-sport', 'bild', 'bleacher-reoprt', 'bloomberg',
            'cnn', 'cbs-news', 'espn', 'focus', 'fox-news', 'fox-sports', 'google-news', 'nbc',
            'new-york-magazine', 'tech-crunch', 'tech-radar', 'the-jerusalem-post', 'the-verge',
            'the-washington-post', 'the-wall-street-journal', 'usa-today', 'ynet', 'wired', 'time', 'the-washington-times'],
        index: 0
    }

    searchInIterationIdx = 0;
    useCountry = true

    constructor(private readonly newsRepository: NewsRepository) { }

    async fetchArticlesFromApiAndSaveToDb(reqQuery: string, filterBy: FilterBy, page: number) {

        const encodedQuery = encodeURI(reqQuery)
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

    buildDbQueryFromFilter(filterBy: FilterBy, searchQuery: string) {

        const { country, source, category, type, language, sortBy, from, to } = filterBy

        const query: any = [];

        if (type) {
            query.push(type)
        }

        if (source) {
            query.push(source)
        }

        if (category) {
            query.push(category)
        }

        if (country) {
            query.push(country)
        }

        if (language) {
            query.push(language)
        }

        if (sortBy) {
            query.push(sortBy)
        }

        // if (dates && (dates.from || dates.to)) {
        //     query.dates.push(dates.from)
        //     query.dates.push(dates.to)
        // }
        if (from) {
            query.push(from)
        }
        if (to) {
            query.push(to)
        }
        // if (searchQuery && searchQuery.length > 0) {
        //     query.searchQuery = searchQuery
        // }
        return query
    }

    buildApiRequestQuery(filterBy: FilterBy, searchQuery: string, page: number) {
        const { country, source, category, type, language, sortBy, from, to } = filterBy
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
        if (from) {
            reqQuery += `from=${from}&`
        }
        if (to) {
            reqQuery += `to=${to}&`
        }
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

            return reqQuery

        }
    }


    getNextParameter(searchIn: FilterOptions) {
        if (searchIn === FilterOptions.TOP_HEADLINES) {
            if (this.useCountry) {
                const queryParameters = { name: this.countryHashMap.name, value: this.countryHashMap.value[this.countryHashMap.index] }
                // Raise countryHashMap index by one and reset when reaches the end
                this.countryHashMap.index = (this.countryHashMap.index + 1) % this.countryHashMap.value.length;
                return queryParameters
            } else {
                const queryParameters = { name: this.categoryHashMap.name, value: this.categoryHashMap.value[this.categoryHashMap.index] }
                // Raise categoryHashMap index by one and reset when reaches the end
                this.categoryHashMap.index = (this.categoryHashMap.index + 1) % this.categoryHashMap.value.length
                return queryParameters
            }
        } else if (searchIn === FilterOptions.EVERYTHING) {
            const queryParameters = { name: this.sourcesHashMap.name, value: this.sourcesHashMap.value[this.sourcesHashMap.index] }
            this.sourcesHashMap.index = (this.sourcesHashMap.index + 1) % this.sourcesHashMap.value.length
            return queryParameters
        }
    }

    @Cron('0 */15 * * * *')
    async fetchEvery15Minutes() {
        const searchIn = this.searchInOptions[this.searchInIterationIdx % this.searchInOptions.length]
        const queryParameters = this.getNextParameter(searchIn)
        if (searchIn === FilterOptions.TOP_HEADLINES) {
            // Changes between country & category
            this.useCountry = !this.useCountry

        }
        const { name, value } = queryParameters
        // name === country / category value === us / business
        const url = `${BASE_URL}${searchIn}?${name}=${value}`
        const encodedQuery = encodeURI(url)
        const res = await axios.get(encodedQuery, config)
        const articles = res.data?.articles

        // Add tags to each article
        const articlesToSave = articles.map(articleData => {
            const tags = [queryParameters.value]
            // const type = filterBy.type // Set the type property
            const article = {
                ...articleData,
                // type,
                tags,
            }
            return article
        })
        // save article to db
        this.newsRepository.saveArticlesToDb(articlesToSave)
        this.searchInIterationIdx++
    }
}