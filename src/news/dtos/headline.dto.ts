import { IsObject, IsString, IsUrl, IsDateString, IsNotEmpty, IsAlpha } from "class-validator"
// import { Source } from "../article.schema"
import { Type } from 'class-transformer'
import { Schema } from '@nestjs/mongoose'

export class Source {
    @IsString()
    id: string;
    @IsString()
    name: string;
}

export class Haedline {
    @IsNotEmpty()
    @IsString()
    @IsAlpha()
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