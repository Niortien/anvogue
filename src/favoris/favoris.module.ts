import { Module } from '@nestjs/common';
import { FavorisService } from './favoris.service';
import { FavorisController } from '../modules/client/controller/favoris.controller';

@Module({
  controllers: [FavorisController],
  providers: [FavorisService],
})
export class FavorisModule {}
