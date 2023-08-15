import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ArticleDocument = HydratedDocument<Article>;

const topHeadlines = 'top-headlines'

export class Source {
    id: string;
    name: string;
}

@Schema()
export class Article {

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
    })
    _id: mongoose.Types.ObjectId

    @Prop({ type: String, required: true, default: topHeadlines })
    type: string;

    @Prop({ type: Source })
    source: Source;

    @Prop()
    author: string | null


    @Prop()
    title: string;


    @Prop()
    description: string;


    @Prop()
    url: string;


    @Prop()
    urlToImage: string | null


    @Prop()
    publishedAt: string;


    @Prop()
    content: string;

    @Prop([String])
    tags: string[];

}

export const ArticleSchema = SchemaFactory.createForClass(Article);

