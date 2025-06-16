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
    type:String,
    description: 'Liste des tailles avec quantité et prix',
    example: [
      {
        taille: 'S',
        quantite: 10,
        prix: 100,
      },
      {
        taille: 'M',
        quantite: 10,
        prix: 100,
      },
    ],
  })
  @IsOptional()
  @IsString()
  tailles?: string;


  @ApiProperty({
    type: [String],
    description: 'Liste des URL ou chemins des images',
    example: ['image1.jpg', 'image2.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value?.map((v: string) => v.trim()))
  images?: string[];

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID de l\'article lié' })
  @IsUUID()
  article_id: string;
}
