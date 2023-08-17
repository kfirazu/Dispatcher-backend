import { IsString, IsDateString } from "class-validator"
import { Schema } from '@nestjs/mongoose';



@Schema()
export class DatesDto {

    @IsDateString()
    from: string

    @IsDateString()
    to: string
}
