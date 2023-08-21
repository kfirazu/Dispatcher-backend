import { IsAlpha, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator"
import { DatesDto } from "./dates-dto"
import { Schema } from '@nestjs/mongoose'
import { Type } from 'class-transformer'



export class FilterByDto {
    @IsNotEmpty()
    @IsString()
    // @IsAlpha()
    type: string

    @IsString()
    source: string

    @IsString()
    category: string

    @IsString()
    country: string

    @IsString()
    language: string

    @IsString()
    sortBy: string

    @IsOptional()
    @ValidateNested()
    @Type(() => DatesDto)
    dates: DatesDto
}