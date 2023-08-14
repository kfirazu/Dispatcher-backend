import { IsMongoId, IsObject, IsString } from "class-validator"
import { Source } from "../article.schema"
import mongoose from "mongoose"


export class CreateArticleDto {

    @IsString()
    searchIn: string
    @IsObject()
    source: Source
    @IsString()

    author: string

    @IsString()

    title: string

    @IsString()

    description: string

    @IsString()

    url: string


    urlToImage: string | null

    @IsString()
    publishedAt: string

    @IsString()
    content: string

    tags: string[]

}

