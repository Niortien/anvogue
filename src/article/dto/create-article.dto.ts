// create-article.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { Etat } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEmpty, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateArticleDto {
    @ApiProperty({
        type: String,
        description: "ID de l'article",
        required: false
    })
    @IsString()
    @IsOptional()
    id?: string;

    @ApiProperty({
        type: String,
        description: "Référence unique de l'article"
    })
    @IsString()
    @IsNotEmpty()
    reference: string;

    @ApiProperty({
        type: String,
        description: "Nom de l'article"
    })
    @IsString()
    @IsNotEmpty()
    nom: string;

    @ApiProperty({
        type: String,
        description: "Description de l'article"
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        type: String,
        description: "ID de la catégorie"
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    categorie_id: string;

    @ApiProperty({
        type: String,
        description: "ID de la collection"
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    collection_id: string;

    @ApiProperty({
        type: String,
        description: "Matière de l'article"
    })
    @IsString()
    @IsNotEmpty()
    matiere: string;

    @ApiProperty({
        type: String,
        description: "Marque de l'article"
    })
    @IsString()
    @IsNotEmpty()
    marque: string;

    @ApiProperty({
        type: String,
        description: "État de l'article",
        enum: Etat
    })
    @IsNotEmpty()
    etat: Etat;

    @ApiProperty({
        type: String,
        description: "Image de l'article",
        required: false
    })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    image?: string;
}