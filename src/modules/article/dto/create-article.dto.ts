import { ApiProperty } from "@nestjs/swagger";
import { Statut } from "@prisma/client";
import { Transform } from "class-transformer";
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    IsUUID,
} from "class-validator";

export class CreateArticleDto {
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
    @IsOptional()
    description?: string;

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
    @IsUUID()
    @IsOptional()
    collection_id?: string;

    @ApiProperty({
        type: Object,
        description: "Informations supplémentaires de l'article (marque, matière, etc.)"
    })
    @IsObject()
    @IsNotEmpty()
    infos: Record<string, any>;

    @ApiProperty({
        type: String,
        description: "Statut de l'article",
        enum: Statut,
        default: Statut.DISPONIBILITE
    })
    @IsNotEmpty()
    status: Statut;

    @ApiProperty({
        type: String,
        description: "Image de l'article",
        required: false
    })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    image?: string;

    @ApiProperty({
        type: Number,
        description: "Quantité de l'article"
    })
    @IsNumber()
    @IsOptional()
    quantite?: number;

    @ApiProperty({
        type: Number,
        description: "Prix de l'article"
    })
    @IsNumber()
    @IsNotEmpty()
    prix: number;

    @ApiProperty({
        type: Boolean,
        description: "Indique si l'article est en promotion"
    })
    @IsBoolean()
    @IsNotEmpty()
    estEnPromotion: boolean;

    @ApiProperty({
        type: Number,
        description: "Prix promotionnel de l'article"
    })
    @IsNumber()
    @IsNotEmpty()
    prixPromotion: number;
}