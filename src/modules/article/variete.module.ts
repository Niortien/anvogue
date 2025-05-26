import { Module } from '@nestjs/common';
import { VarieteService } from './services/variete.service';
import { VarieteController } from './controllers/variete.controller';

@Module({
  controllers: [VarieteController],
  providers: [VarieteService],
})
export class VarieteModule {}
