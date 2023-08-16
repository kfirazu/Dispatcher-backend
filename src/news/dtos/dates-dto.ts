import { IsString } from "class-validator"
import { Schema } from '@nestjs/mongoose';



@Schema()
export class DatesDto {

    @IsString()
    from: string

    @IsString()
    to: string
}
