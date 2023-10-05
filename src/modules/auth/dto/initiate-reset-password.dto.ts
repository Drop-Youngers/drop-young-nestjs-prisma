import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class InitiateResetPasswordDTO {

    @IsEmail()
    @ApiProperty()
    email: string;
    
}