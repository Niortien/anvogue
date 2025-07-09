import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';


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

export class CreateVarieteDto {
  @ApiProperty({ example: 'Rouge', description: 'Couleur de la variété' })
  @IsString()
  couleur: string;

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
  tailles?: TailleDto[];


  @ApiProperty({
    type: [String],
    description: 'Liste des URL ou chemins des images',
    example: ['image1.jpg', 'image2.jpg'],
  })
  @IsOptional()
  
  @ApiProperty({ type: String, description: "Image de l'article", required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  image?: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID de l\'article lié' })
  @IsUUID()
  article_id: string;
}
