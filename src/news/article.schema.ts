import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { IsObject, IsString, IsUrl, IsArray } from "class-validator"
import { ApiProperty } from '@nestjs/swagger'


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

    @ApiProperty({example: '64db70a2770cd7562e53e23d'})
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
    })
    _id: mongoose.Types.ObjectId

    @ApiProperty({
        example: 'top-headlines'
    })
    @Prop({ type: String, required: true, default: topHeadlines })
    type: string

    @ApiProperty({ example: { id: 'cnn', name: 'CNN' } })
    @Prop({ type: Source })
    source?: Source

    @ApiProperty({ example: 'Michele Luhn' })
    @Prop({ type: String })
    author?: string | null

    @ApiProperty({ example: '5 things to know before the stock market opens Monday - CNBC' })
    @Prop({ type: String })
    title?: string

    @ApiProperty({ example: 'Here are the most important news items that investors need to start their trading day...' })
    @Prop({ type: String })
    description?: string

    @ApiProperty({ example: 'https://www.cnbc.com/2023/08/14/5-things-to-know-before-the-stock-market-opens-monday-august-14.html' })
    @Prop({ type: String })
    url?: string

    @ApiProperty({ example: 'https://image.cnbcfm.com/api/v1/image/107261743-1687536824089-gettyimages-1258918262-porzycki-vermonte230619_npiV3.jpeg?v=1692012809&w=1920&h=1080' })
    @Prop({ type: String })
    urlToImage?: string | null

    @ApiProperty({ example: '2023-08-14T11:33:29Z' })
    @Prop({ type: Date })
    publishedAt?: Date

    @ApiProperty({ example: 'Here are the most important news items that investors need to start their trading day:1. State of the consumer...' })
    @Prop({ type: String })
    content?: string

    @ApiProperty({ example: ['top-headlines', 'us'] })
    @Prop({ type: [String] })
    tags: string[]

}

export const ArticleSchema = SchemaFactory.createForClass(Article)

