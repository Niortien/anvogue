import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { StatutCommande } from "@prisma/client";
import { IsNumber, IsOptional, IsUUID, ValidateNested, IsArray, IsString, IsPositive, IsInt } from "class-validator";
import { Type } from "class-transformer";

export class CreateLigneCommandeDto {
  @ApiProperty({ description: "Quantité commandée", example: 2 })
  @IsNumber()
  @IsPositive()
  quantite: number;

  @ApiProperty({ description: "Prix unitaire", example: 50.5 })
  @IsNumber()
  @IsPositive()
  prixUnitaire: number;

  @ApiPropertyOptional({ description: "Taille", example: "L" })
  @IsOptional()
  @IsString()
  taille?: string;

  @ApiPropertyOptional({ description: "Couleur", example: "Rouge" })
  @IsOptional()
  @IsString()
  couleur?: string;

  @ApiPropertyOptional({ description: "ID de l'article", format: "uuid" })
  @IsOptional()
  @IsUUID()
  articleId?: string;

  @ApiPropertyOptional({ description: "ID de la variété", format: "uuid" })
  @IsOptional()
  @IsUUID()
  varieteId?: string;
}

export class CreateCommandeDto {
  @ApiProperty({ description: 'Total de la commande', example: 150.75 })
  @IsNumber()
  total: number;

  @ApiPropertyOptional({ description: 'Montant de la remise appliquée', example: 10 })
  @IsOptional()
  @IsNumber()
  remise?: number;

  @ApiPropertyOptional({ description: 'Total effectivement payé par le client', example: 140.75 })
  @IsOptional()
  @IsNumber()
  totalPaye?: number;

  @ApiPropertyOptional({ description: 'Statut de la commande', enum: StatutCommande, default: StatutCommande.EN_ATTENTE })
  @IsOptional()
  statut?: StatutCommande;

  @ApiPropertyOptional({ description: 'ID de l’utilisateur (si connecté)', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  utilisateur_id?: string;

  @ApiProperty({ description: 'ID du client', format: 'uuid' })
  @IsUUID()
  client_id: string;

  @ApiProperty({ type: [CreateLigneCommandeDto], description: 'Lignes de la commande' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLigneCommandeDto)
  lignes: CreateLigneCommandeDto[];
}
