import { IsString, ValidateNested } from "class-validator"
import { DatesDto } from "./dates-dto"
import { Schema } from '@nestjs/mongoose'
import { Type } from 'class-transformer'



@Schema()
export class FilterByDto {
    @IsString()
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

    @ValidateNested()
    @Type(() => DatesDto)
    dates: DatesDto
}