import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUrl } from "class-validator";

export class UpdateAvatarDTO {

    @IsNotEmpty({ message: "Avatar url is required" })
    @IsUrl({}, { message: "Invalid avatar url" })
    @ApiProperty({})
    avatarUrl: string;

}