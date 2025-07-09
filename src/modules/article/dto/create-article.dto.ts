import { ApiProperty } from "@nestjs/swagger";
import { Genres } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
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
  @ApiProperty({ type: String, description: "Nom de l'article" })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ type: String, description: "Description de l'article", required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: String, description: "ID de la catégorie" })
  @IsUUID()
  @IsNotEmpty()
  categorie_id: string;

  @ApiProperty({ type: String, description: "ID de la collection", required: false })
  @IsUUID()
  @IsOptional()
  collection_id?: string;

  @ApiProperty({
    type: [TailleDto],
    required: false,
    description: "Informations sur les tailles/variantes de l'article",
    example: [
      { taille: "S", quantite: 10, prix: 120 },
      { taille: "M", quantite: 5, prix: 130 },
    ],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TailleDto)
  infos?: TailleDto[];

  @ApiProperty({ type: String, description: "Image de l'article", required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  image?: string;

  @ApiProperty({ type: Number, description: "Quantité de l'article", required: false })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value === null || value === undefined ? undefined : Number(value)))
  quantite?: number;

  @ApiProperty({ type: Number, description: "Prix de l'article" })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  prix: number;

  @ApiProperty({ type: Boolean, description: "Indique si l'article est en promotion", required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === "false" || value === false) return false;
    if (value === "true" || value === true) return true;
    return Boolean(value);
  })
  estEnPromotion?: boolean;

  @ApiProperty({ type: Number, description: "Prix promotionnel de l'article", required: false })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value === null || value === undefined ? undefined : Number(value)))
  prixPromotion?: number;

  @ApiProperty({ type: String, description: "Genre de l'article", enum: Genres })
  @IsEnum(Genres)
  @Transform(({ value }) => {
    if (typeof value === "string") return value.toUpperCase();
    return value;
  })
  genre: Genres;
}
