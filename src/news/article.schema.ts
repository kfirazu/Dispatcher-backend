import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { IsObject, IsString, IsUrl, IsArray } from "class-validator"


export type ArticleDocument = HydratedDocument<Article>;

const topHeadlines = 'top-headlines'


@Schema()
export class Source {
    @Prop({ type: String })
    id: string;
    @Prop({ type: String })
    name: string;
}


@Schema({ timestamps: true })
export class Article {

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
    })
    _id: mongoose.Types.ObjectId

    @Prop({ type: String, required: true, default: topHeadlines })
    type: string

    @Prop({ type: Source })
    source?: Source

    @Prop({ type: String })
    author?: string | null


    @Prop({ type: String })
    title?: string


    @Prop({ type: String })
    description?: string


    @Prop({ type: String })
    url?: string


    @Prop({ type: String })
    urlToImage?: string | null


    @Prop({ type: Date })
    publishedAt?: Date


    @Prop({ type: String })
    content?: string

    @Prop({ type: [String] })
    tags: string[]

}

export const ArticleSchema = SchemaFactory.createForClass(Article)

