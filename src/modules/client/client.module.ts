import { Module } from '@nestjs/common';
import { ClientController } from './controller/client.controller';
import { ClientService } from './services/client.service';
import { FavorisService } from './services/favoris.service';
import { FavorisController } from './controller/favoris.controller';
import { NoteController } from 'src/modules/client/controller/note.controller';
import { NoteService } from './services/note.service';




@Module({
  controllers: [ClientController,FavorisController,NoteController],
  providers: [ClientService,FavorisService,NoteService],
  exports: [ClientService]
})
export class ClientModule {}
