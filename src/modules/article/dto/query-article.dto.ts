import { Article } from "@prisma/client";
import { IsOptional, IsString } from "class-validator";

export class QueryArticleDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    categorie?: string;

    @IsOptional()
    @IsString()
    collection?: string;

    @IsOptional()
    @IsString()
    couleur?: string;

    @IsOptional()
    @IsString()
    taille?: string;

    @IsOptional()
    @IsString()
    genre?: string;

    @IsOptional()
    @IsString()
    reference?: string;

    @IsOptional()
    @IsString()
    nom?: string;

    @IsOptional()
    @IsString()
    quantite?: string;

    @IsOptional()
    @IsString()
    prix?: string;

    @IsOptional()
    @IsString()
    prix_start?: string;

    @IsOptional()
    @IsString()
    prix_end?: string;

    @IsOptional()
    @IsString()
    estEnPromotion?: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    page?: string;

    @IsOptional()
    @IsString()
    limit?: string;
}


export class QueryArticleResponseDto {
    data: Article[];
    total: number;
    page: number;
    limit: number;
}
