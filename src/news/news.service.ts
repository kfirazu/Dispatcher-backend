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

const searchInOptions = ['top-headlines', 'everything']
const countryHashMap = {
    name: 'country',
    value: ['us', 'au', 'br', 'cn', 'de', 'fr', 'hk', 'it', 'il', 'ng', 'ru', ' pl',
        'za', 'gb', 'ae', 'ar', 'be', 'eg', 'hu', 'pt', 'sa', 'rs', 'th', 'tw'],
    index: 0
}

const categoryHashMap = {
    name: 'category',
    value: ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'],
    index: 0
}

const sourcesHashMap = {
    name: 'sources',
    value: ['abc-news', 'axios', 'bbc-news', 'bbc-sport', 'bild', 'bleacher-reoprt', 'bloomberg',
        'cnn', 'cbs-news', 'espn', 'focus', 'fox-news', 'fox-sports', 'google-news', 'nbc',
        'new-york-magazine', 'tech-crunch', 'tech-radar', 'the-jerusalem-post', 'the-verge',
        'the-washington-post', 'the-wall-street-journal', 'usa-today', 'ynet', 'wired', 'time', 'the-washington-times'],
    index: 0
}

let searchInIterationIdx = 0
let useCountry = true

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
            reqQuery += `country = ${country}& `
        }
        if (category !== '') {
            reqQuery += `category = ${category}& `
        }
        if (source !== '') {
            reqQuery += `sources = ${source}& `
        }
        if (language !== '') {
            reqQuery += `language = ${language}& `
        }
        if (sortBy !== '') {
            reqQuery += `sortBy = ${sortBy}& `
        }
        if (searchQuery) {
            reqQuery += `q = ${searchQuery}& `
        }
        // if (dates.from !== '' && dates.to !== '') {
        //     reqQuery += `from = ${ dates.from }& to=${ dates.to }& `
        // }
        if (page) {
            reqQuery += `page = ${page} `
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


    getNextParameter(searchIn: string) {
        if (searchIn === FilterOptions.TOP_HEADLINES) {
            if (useCountry) {
                const queryParameters = { name: countryHashMap.name, value: countryHashMap.value[countryHashMap.index] }
                // Raise countryHashMap index by one and reset when reaches the end
                countryHashMap.index = (countryHashMap.index + 1) % countryHashMap.value.length;
                return queryParameters
            } else {
                const queryParameters = { name: categoryHashMap.name, value: categoryHashMap.value[categoryHashMap.index] }
                // Raise categoryHashMap index by one and reset when reaches the end
                categoryHashMap.index = (categoryHashMap.index + 1) % categoryHashMap.value.length
                return queryParameters
            }
        } else if (searchIn === FilterOptions.EVERYTHING) {
            const queryParameters = { name: sourcesHashMap.name, value: sourcesHashMap.value[sourcesHashMap.index] }
            sourcesHashMap.index = (sourcesHashMap.index + 1) % sourcesHashMap.value.length
            return queryParameters
        }
    }

    async fetchEvery15Minutes() {
        const searchIn = searchInOptions[searchInIterationIdx % searchInOptions.length]
        const queryParameters = this.getNextParameter(searchIn)
        if (searchIn === FilterOptions.TOP_HEADLINES) {
            // Changes between country & category
            useCountry = !useCountry

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
        searchInIterationIdx++
    }

}