
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Saison } from '@prisma/client';

export class CreateCollectionDto {
  
  @ApiProperty({
    description: "Nom de la collection",
    example: "Été 2025",
  })
  @IsNotEmpty()
  @IsString()
  nom: string;

  @ApiPropertyOptional({
    description: "Description de la collection",
    example: "Une collection inspirée des tendances estivales.",
  })
  @IsOptional()
  @IsString()
  description?: string;


@ApiPropertyOptional({
    description: "Description de la collection",
    example: "ete.",
  })
 @IsOptional()
  @IsString()
  saison:Saison
}
