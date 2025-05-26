import { Module } from '@nestjs/common';

import { FavorisController } from './controller/favoris.controller';
import { FavorisService } from 'src/modules/client/services/favoris.service';

@Module({
  controllers: [FavorisController],
  providers: [FavorisService],
})
export class FavorisModule {}
