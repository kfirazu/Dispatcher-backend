import { OnModuleInit } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Article, ArticleDocument } from "./article.schema"
import { Model } from "mongoose"
import { FilterBy } from "src/models/filter-by.interface"

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
            await this.articleModel.insertMany(articlesToInsert)
        }
        return articlesToInsert
    }

    async getFilteredArticles(query: any, searchQuery?: string, page?: number) {
        let articlesQuery

        if (searchQuery && searchQuery.length > 0) {
            articlesQuery = this.articleModel.find({
                $and: [
                    { tags: { $all: query } },
                    {
                        $or: [
                            { title: { $regex: searchQuery, $options: 'i' } },
                            { description: { $regex: searchQuery, $options: 'i' } },
                            { content: { $regex: searchQuery, $options: 'i' } },
                        ],
                    },
                    {
                        $or: [{ 'source.id': query.source }]
                    }
                ],
            })
        } else {
            articlesQuery = this.articleModel.find({ tags: { $all: query } })
        }

        const articles = await articlesQuery
            .skip((page - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE)
            .lean()

        return articles
    }

    async getAllData() {
        const allArticles = await this.articleModel.find().lean()
        console.log('allArticles:', allArticles)
        return allArticles
    }

}

