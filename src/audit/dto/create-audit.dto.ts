import { ApiProperty } from "@nestjs/swagger";
import {  IsNotEmpty, IsString } from "class-validator";



export class CreateAuditDto {
  @ApiProperty({
    type: String,
    description: "ID de l'utilisateur qui a effectué l'action",
    example: "123e4567-e89b-12d3-a456-426614174000"
  })
  @IsString()
  @IsNotEmpty()
  utilisateur_id: string;

  @ApiProperty({
    type: String,
    description: "Nom de la table ou de l'entité concernée",
    example: "Boutique"
  })
  @IsString()
  @IsNotEmpty()
  table: string;

  @ApiProperty({
    type: String,
    description: "ID de l'enregistrement concerné dans la table",
    example: "456e7890-e12b-34d5-a678-426614174000"
  })
  @IsString()
  @IsNotEmpty()
  table_id: string;

  @ApiProperty({
    type: String,
    description: "Description de l'action effectuée",
    example: "Mise à jour des coordonnées de la boutique"
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
