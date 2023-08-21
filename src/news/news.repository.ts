import { OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Article, ArticleDocument } from "./article.schema";
import { Model } from "mongoose";

const PAGE_SIZE = 10

export class NewsRepository implements OnModuleInit {
    constructor(@InjectModel(Article.name) private articleModel: Model<ArticleDocument>) { }


    onModuleInit() {
        if (this.articleModel.db.readyState === 1)
            console.log('News Database connection is ready!')
        else
            console.log('News Database connection is not ready!')
    }

    async saveArticlesToDb(articlesData: ArticleDocument[]) {
        const articlesToInsert = []

        for (const article of articlesData) {
            const existingArticle = await this.articleModel.findOne({ url: article.url })

            if (!existingArticle) {
                articlesToInsert.push(article)
            }
        }

        if (articlesToInsert.length > 0) {
            console.log('inserting data')
            await this.articleModel.insertMany(articlesToInsert)
        }
        console.log('not inserting data')
        return articlesToInsert
    }

    async getFilteredArticles(query: any, searchQuery?: string, page?: number) {
        console.log('searchQuery:', searchQuery)
        if (searchQuery && searchQuery.length > 0) {
            let filteredArticles = await this.articleModel
                .find({ tags: query })
                .skip((page - 1) * PAGE_SIZE)
                .limit(PAGE_SIZE)
                .lean();
            console.log('filteredArticles before filter by keyword:', filteredArticles)
            filteredArticles = filteredArticles.filter(article => {
                return (
                    article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    article.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    article.content?.toLowerCase().includes(searchQuery.toLowerCase())
                )
            })
            return filteredArticles
        } else {
            const articles = await this.articleModel
                .find({ tags: query })
                .skip((page - 1) * PAGE_SIZE)
                .limit(PAGE_SIZE)
                .lean();

            return articles;
        }
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

        return articles;
    }


}

