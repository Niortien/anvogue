import { PartialType } from '@nestjs/swagger';
import { CreateVarieteDto } from '../../modules/article/dto/create-variete.dto';

export class UpdateVarieteDto extends PartialType(CreateVarieteDto) {}
