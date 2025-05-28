import { PartialType } from '@nestjs/swagger';
import { CreateVarieteDto } from './create-variete.dto';
import { IsOptional } from 'class-validator';

export class UpdateVarieteDto extends PartialType(CreateVarieteDto) {
    @IsOptional()
    article_id?: string;
}
