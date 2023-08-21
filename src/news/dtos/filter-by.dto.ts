import { IsAlpha, IsNotEmpty, IsOptional, IsString, ValidateNested, IsDateString } from "class-validator"
import { DatesDto } from "./dates-dto"
import { Schema } from '@nestjs/mongoose'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'



export class FilterByDto {
    @ApiProperty({
        description: 'Filter type',
        example: 'top-headlines'

    })
    @IsNotEmpty()
    @IsString()
    // @IsAlpha()
    type: string

    @ApiProperty()
    //     description: 'Filter source',
    //     example: 'cnn'

    // })
    @IsString()
    source: string

    @ApiProperty({
        description: 'Filter category',
        example: 'sports'

    })
    @IsString()
    category: string

    @ApiProperty({
        description: 'Filter country',
        example: 'israel'

    })
    @IsString()
    country: string

    @ApiProperty()
    //     description: 'Filter language',
    //     example: 'english'

    // })
    @IsString()
    language: string

    @ApiProperty({
        description: 'Filter sort by',
        example: 'relevancy'

    })
    @IsString()
    sortBy: string

    @ApiProperty()
    //     description: 'Filter dates',
    //     example: { from: '19/08/2023', to: '20/08/2023' }

    // })
    // @IsOptional()
    // @ValidateNested()
    // @Type(() => DatesDto)
    // dates?: DatesDto

    @IsOptional()
    @IsDateString()
    from?: Date

    @IsOptional()
    @IsDateString()
    to?: Date


}