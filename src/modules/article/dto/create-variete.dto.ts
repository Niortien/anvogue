import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { json } from 'stream/consumers';



export class CreateVarieteDto {
  @ApiProperty({ example: 'REF123', description: 'Référence de la variété' })
  @IsString()
  reference: string;

  @ApiProperty({ example: 'Rouge', description: 'Couleur de la variété' })
  @IsString()
  couleur: string;

  @ApiProperty({
    type: json,
    description: 'Liste des tailles avec quantité et prix',
  })
  @IsArray()
  @ValidateNested({ each: true })
  
  tailles: Record<string, any>;;

  @ApiProperty({
    type: [String],
    description: 'Liste des URL ou chemins des images',
    example: ['image1.jpg', 'image2.jpg'],
  })
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value?.map((v: string) => v.trim()))
  image: string[];

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID de l\'article lié' })
  @IsUUID()
  article_id: string;
}
