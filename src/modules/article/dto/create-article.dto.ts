import { ApiProperty } from "@nestjs/swagger";
import { Genre } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    IsUUID,
    ValidateNested,
} from "class-validator";

export class TailleDto {
  @IsString()
  @IsOptional()
  taille?: string;

  @IsNumber()
  @IsOptional()
  quantite?: number;

  @IsNumber()
  @IsOptional()
  prix?: number;
}
export class CreateArticleDto {
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
  type: [TailleDto],
  required: false,
  description: 'Informations sur les tailles/variantes de l\'article',
  example: [
    { taille: 'S', quantite: 10, prix: 120 },
    { taille: 'M', quantite: 5, prix: 130 },
  ],
})
@IsArray()
@IsOptional()
@ValidateNested({ each: true })
@Type(() => TailleDto)
infos?: TailleDto[];




    @ApiProperty({
        type: String,
        description: "Image de l'article",
        required: false
    })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    image: string;

    @ApiProperty({
        type: Number,
        description: "Quantité de l'article"
    })
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @IsOptional()
    quantite: number;

    @ApiProperty({
        type: Number,
        description: "Prix de l'article"
    })
    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    prix: number;

    @ApiProperty({
        type: Boolean,
        description: "Indique si l'article est en promotion"
    })
    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => Boolean(value))
    estEnPromotion?: boolean;

    @ApiProperty({
        type: Number,
        description: "Prix promotionnel de l'article"
    })
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => Number(value))
    prixPromotion: number;

    @ApiProperty({
        type: String,
        description: "Genre de l'article",
        enum: Genre
    })
    @IsEnum(Genre)
    @IsOptional()
    genre?: Genre;
}