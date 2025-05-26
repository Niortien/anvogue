import { Module } from '@nestjs/common';
import { VarieteService } from '../modules/article/services/variete.service';
import { VarieteController } from '../modules/article/controllers/variete.controller';

@Module({
  controllers: [VarieteController],
  providers: [VarieteService],
})
export class VarieteModule {}
