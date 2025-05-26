import { Module } from '@nestjs/common';

import { NoteController } from '../modules/client/controller/note.controller';
import { NoteService } from 'src/modules/client/services/note.service';

@Module({
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
