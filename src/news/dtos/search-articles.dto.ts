import { IsString, IsNumber, ValidateNested, IsNotEmpty, IsPositive, IsInt, IsDivisibleBy} from "class-validator"
import { Type } from 'class-transformer'
import { FilterByDto } from "./filter-by.dto"

export class SearchArticlesDto {

    @ValidateNested()
    @IsNotEmpty()
    @Type(() => FilterByDto)
    filterBy: FilterByDto

    @IsString()
    searchQuery: string

    @IsNumber()
    @IsInt()
    @IsPositive()
    @IsDivisibleBy(1)

    page: number

}



