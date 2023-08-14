import { OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Article, ArticleDocument } from "./article.schema";
import { Model } from "mongoose";
import { Headline } from "src/models/headline-interface";


export class NewsRepository implements OnModuleInit {
    constructor(@InjectModel(Article.name) private ArticleModel: Model<ArticleDocument>) { }


    onModuleInit() {
        if (this.ArticleModel.db.readyState === 1)
            console.log('News Database connection is ready!')
        else
            console.log('News Database connection is not ready!')
    }
    async saveArticlesToDb(articlesData: ArticleDocument[]) {
        const articlesToSave = articlesData.map(articleData => {
            const tags = ['category', 'business']; // Customize the tags as needed
            const searchIn = 'top-headlines'; // Set the searchIn property
            const article = new this.ArticleModel({
                ...articleData,
                searchIn,
                tags,
            });
            return article;
        });

        console.log('articlesToSave:', articlesToSave)
        const savedArticles = await this.ArticleModel.insertMany(articlesToSave);
        return savedArticles;

        // extract articles array from response

        // push articles array into mongo articles collection

    }

}