import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('notes') // Regroupe toutes les routes dans Swagger sous "notes"
@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une note' })
  @ApiCreatedResponse({ description: 'Note créée avec succès.' })
  @ApiBadRequestResponse({ description: 'Données invalides.' })
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.noteService.create(createNoteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les notes' })
  @ApiOkResponse({ description: 'Liste des notes retournée avec succès.' })
  findAll() {
    return this.noteService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une note par ID' })
  @ApiOkResponse({ description: 'Note trouvée.' })
  @ApiNotFoundResponse({ description: 'Note introuvable.' })
  findOne(@Param('id') id: string) {
    return this.noteService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une note par ID' })
  @ApiOkResponse({ description: 'Note mise à jour avec succès.' })
  @ApiNotFoundResponse({ description: 'Note introuvable.' })
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.noteService.update(id, updateNoteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une note par ID' })
  @ApiOkResponse({ description: 'Note supprimée avec succès.' })
  @ApiNotFoundResponse({ description: 'Note introuvable.' })
  remove(@Param('id') id: string) {
    return this.noteService.remove(id);
  }
}
