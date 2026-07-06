import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    IsUUID,
    Min,
    ValidateNested,
} from "class-validator";
import { StatutCommande } from "@prisma/client";

export class LigneCommandeDto {
    @ApiProperty({ type: Number, description: "Quantité commandée" })
    @IsNumber()
    @IsPositive()
    quantite: number;

    @ApiProperty({ type: Number, description: "Prix unitaire au moment de la commande" })
    @IsNumber()
    @IsPositive()
    prixUnitaire: number;

    @ApiProperty({ type: String, description: "Taille choisie", required: false })
    @IsString()
    @IsOptional()
    taille?: string;

    @ApiProperty({ type: String, description: "Couleur choisie", required: false })
    @IsString()
    @IsOptional()
    couleur?: string;

    @ApiProperty({ type: String, description: "ID de l'article", required: false })
    @IsUUID()
    @IsOptional()
    articleId?: string;

    @ApiProperty({ type: String, description: "ID de la variété", required: false })
    @IsUUID()
    @IsOptional()
    varieteId?: string;
}

export class CreateCommandeDto {
    @ApiProperty({ type: String, description: "ID du client" })
    @IsUUID()
    @IsNotEmpty()
    clientId: string;

    @ApiProperty({ type: String, description: "ID de l'utilisateur (staff) ayant enregistré la commande", required: false })
    @IsUUID()
    @IsOptional()
    utilisateurId?: string;

    @ApiProperty({ type: Number, description: "Total de la commande" })
    @IsNumber()
    @Min(0)
    total: number;

    @ApiProperty({ type: Number, description: "Remise appliquée", required: false })
    @IsNumber()
    @Min(0)
    @IsOptional()
    remise?: number;

    @ApiProperty({ type: Number, description: "Total déjà payé", required: false })
    @IsNumber()
    @Min(0)
    @IsOptional()
    totalPaye?: number;

    @ApiProperty({ enum: StatutCommande, description: "Statut de la commande", required: false })
    @IsEnum(StatutCommande)
    @IsOptional()
    statut?: StatutCommande;

    @ApiProperty({ type: [LigneCommandeDto], description: "Lignes de la commande" })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LigneCommandeDto)
    lignes: LigneCommandeDto[];
}
