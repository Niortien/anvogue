import { ApiProperty } from "@nestjs/swagger";
import { Type } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategorieDto {
    @ApiProperty({
        type: String,
        description: "Référence unique de la catégorie"
    })
    @IsString()
    @IsNotEmpty()
    reference: string;

    @ApiProperty({
        type: String,
        description: "Nom de la catégorie"
    })
    @IsString()
    @IsNotEmpty()
    nom: string;

    @ApiProperty({
        type: String,
        description: "Description de la catégorie"
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        type: String,
        description: "Type de produit",
        enum: Type,
        default: Type.VETEMENT
    })
    @IsEnum(Type)
    @IsOptional()
    type?: Type;
}