import { PartialType } from '@nestjs/swagger';
import { CreateVarieteDto } from './create-variete.dto';

export class UpdateVarieteDto extends PartialType(CreateVarieteDto) {}
