import { IsString, IsNumber, ValidateNested, IsNotEmpty, IsPositive, IsInt, IsDivisibleBy} from "class-validator"
import { Type } from 'class-transformer'
import { FilterByDto } from "./filter-by.dto"
import { ApiProperty } from '@nestjs/swagger'

export class SearchArticlesDto {

    @ApiProperty()
    @ValidateNested()
    @IsNotEmpty()
    @Type(() => FilterByDto)
    filterBy: FilterByDto

    @ApiProperty()
    @IsString()
    searchQuery: string

    @ApiProperty()
    @IsNumber()
    @IsInt()
    @IsPositive()
    @IsDivisibleBy(1)
    page: number

}



