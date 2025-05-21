import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateAuditDto {
  @ApiProperty({
    type: String,
    description: "Nom de la table concernée"
  })
  @IsString()
  @IsNotEmpty()
  table: string;

  @ApiProperty({
    type: String,
    description: "ID de l'enregistrement concerné dans la table"
  })
  @IsString()
  @IsNotEmpty()
  table_id: string;

  @ApiProperty({
    type: String,
    description: "Message décrivant l'action effectuée"
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    type: String,
    description: "ID de l'utilisateur qui a effectué l'action"
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  utilisateur_id: string;
}