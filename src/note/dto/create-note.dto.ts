import { IsUUID, IsNotEmpty, IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNoteDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(5)
  etoile: number;

  @IsString()
  @IsNotEmpty()
  commentaire: string;

  @IsOptional()
  @IsUUID()
  reponse?: string;

  @IsUUID()
  client_id: string;

  @IsUUID()
  article_id: string;
}
