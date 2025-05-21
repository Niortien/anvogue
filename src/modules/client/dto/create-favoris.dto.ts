import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateFavorisDto {
    @ApiProperty({
        type: String,
        description: "ID du client"
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    client_id: string;

    @ApiProperty({
        type: String,
        description: "ID de l'article"
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    article_id: string;
}