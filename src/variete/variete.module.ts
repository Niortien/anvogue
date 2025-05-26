import { Module } from '@nestjs/common';
import { VarieteService } from './variete.service';
import { VarieteController } from './variete.controller';

@Module({
  controllers: [VarieteController],
  providers: [VarieteService],
})
export class VarieteModule {}
