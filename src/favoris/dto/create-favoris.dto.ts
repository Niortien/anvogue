import { IsUUID } from 'class-validator';

export class CreateFavorisDto {
  @IsUUID()
  client_id: string;

  @IsUUID()
  article_id: string;
}
