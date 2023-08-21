import { IsString, IsDateString } from "class-validator"
import { Schema } from '@nestjs/mongoose';



@Schema()
export class DatesDto {

    @IsDateString()
    // @ClassTransform(({ value }) => value.from === '' ? null : value.from)
    from?: Date 

    @IsDateString()
    // @ClassTransform(({ value }) => value.to === '' ? null : value.to)
    to?: Date 
}
