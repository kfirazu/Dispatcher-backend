import { IsObject, IsString, IsUrl, IsDateString } from "class-validator"
import { Source } from "../article.schema"
import { Type } from 'class-transformer'
import { Schema } from '@nestjs/mongoose'

@Schema()
export class Haedline {
    @IsString()
    type: string

    @IsObject()
    @Type(() => Source)
    source: Source

    @IsString()
    author: string

    @IsString()
    title: string

    @IsString()
    description: string

    @IsString()
    @IsUrl()
    url: string

    @IsString()
    @IsUrl()
    urlToImage: string | null

    @IsString()
    @IsDateString()
    publishedAt: string

    @IsString()
    content: string
}