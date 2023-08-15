import { OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Article, ArticleDocument } from "./article.schema";
import { Model } from "mongoose";
import { Headline } from "src/models/headline.interface";
import { FilterBy } from "src/models/filterBy.interface";


export class NewsRepository implements OnModuleInit {
    constructor(@InjectModel(Article.name) private articleModel: Model<ArticleDocument>) { }


    onModuleInit() {
        if (this.articleModel.db.readyState === 1)
            console.log('News Database connection is ready!')
        else
            console.log('News Database connection is not ready!')
    }

    async saveArticlesToDb(articlesData: ArticleDocument[], filterBy: FilterBy) {
        const articlesToSave = articlesData.map(articleData => {
            const tags = Object.values(filterBy).filter(value => typeof value === 'string' && value !== '');
            const type = filterBy.type // Set the type property
            const article = new this.articleModel({
                ...articleData,
                type,
                tags,
            });
            return article;
        });

        console.log('articlesToSave:', articlesToSave)
        // push articles array into mongo articles collection
        const savedArticles = await this.articleModel.insertMany(articlesToSave);
        return savedArticles;
    }

    async getAllData() {
        const allArticles = await this.articleModel.find().lean()
        console.log('allArticles:', allArticles)
        return allArticles
    }
    async getArticlesByCountry(country: string): Promise<Article[]> {
        const articles = await this.articleModel.find({
            tags: country,
        }).lean();
        // console.log('articles:', articles)

        return articles;
    }

    async getFilteredArticles(query: any, page: number) {
        const articles = await this.articleModel.find({ tags: query }).lean()
        return articles
    }
}

