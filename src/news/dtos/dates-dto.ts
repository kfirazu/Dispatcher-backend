import { IsString, IsDateString, IsOptional } from "class-validator"
import { Schema } from '@nestjs/mongoose';
// import {  ClassTransform } from 'class-transformer'




@Schema()
export class DatesDto {

    @IsOptional()
    @IsDateString()
    // @ClassTransform(({ value }) => value.from === '' ? null : value.from)
    from: string | undefined

    @IsOptional()
    @IsDateString()
    // @ClassTransform(({ value }) => value.to === '' ? null : value.to)
    to: string | undefined
}
