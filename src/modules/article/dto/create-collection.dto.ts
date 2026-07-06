import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCollectionDto {
    @ApiProperty({
        type: String,
        description: "Référence de la collection (générée automatiquement si absente)",
        required: false,
    })
    @IsString()
    @IsOptional()
    reference?: string;

    @ApiProperty({
        type: String,
        description: "Nom de la collection"
    })
    @IsString()
    @IsNotEmpty()
    nom: string;

    @ApiProperty({
        type: String,
        description: "Description de la collection"
    })
    @IsString()
    @IsOptional()
    description?: string;
}