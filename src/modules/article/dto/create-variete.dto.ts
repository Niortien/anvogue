import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
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
        description: "Référence de la variété"
    })
    @IsString()
    @IsNotEmpty()
    reference: string;

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
    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => TailleInfo)
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