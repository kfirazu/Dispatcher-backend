import { IsString, IsNumber, ValidateNested, IsNotEmpty } from "class-validator"
import { Type } from 'class-transformer'
import { FilterByDto } from "./filter-by.dto"

export class CreateArticleDto {

    @ValidateNested()
    @IsNotEmpty()
    @Type(() => FilterByDto)
    filterBy: FilterByDto

    @IsString()
    searchQuery: string

    @IsNumber()
    page: number

}



