import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    ValidateNested
} from "class-validator";

export class TailleInfo {
    @ApiProperty({
        type: String,
        description: "Taille du vêtement (S, M, L, etc.)"
    })
    @IsString()
    @IsNotEmpty()
    taille: string;

    @ApiProperty({
        type: Number,
        description: "Quantité disponible pour cette taille"
    })
    @IsNumber()
    @IsNotEmpty()
    quantite: number;

    @ApiProperty({
        type: Number,
        description: "Prix pour cette taille"
    })
    @IsNumber()
    @IsOptional()
    prix: number;
}

export class CreateVarieteDto {
    @ApiProperty({
        type: String,
        description: "Référence de la variété (générée automatiquement si absente)",
        required: false,
    })
    @IsString()
    @IsOptional()
    reference?: string;

    @ApiProperty({
        type: String,
        description: "Couleur de la variété"
    })
    @IsString()
    @IsNotEmpty()
    couleur: string;

    @ApiProperty({
        type: [TailleInfo],
        description: "Liste des tailles disponibles avec leur quantité et prix"
    })
    @Transform(({ value }) => {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        return Array.isArray(parsed) ? parsed.map((item) => Object.assign(new TailleInfo(), item)) : parsed;
    })
    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    tailles: TailleInfo[];

    @ApiProperty({
        type: [String],
        description: "Images de la variété"
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    image: string[];

    @ApiProperty({
        type: String,
        description: "ID de l'article associé"
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    article_id: string;
}