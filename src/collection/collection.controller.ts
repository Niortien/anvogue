import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('collection')
@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle collection' })
  @ApiResponse({ status: 201, description: 'Collection créée avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionService.create(createCollectionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les collections' })
  @ApiResponse({ status: 200, description: 'Liste des collections retournée.' })
  findAll() {
    return this.collectionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une collection par son ID' })
  @ApiParam({ name: 'id', description: 'ID de la collection' })
  @ApiResponse({ status: 200, description: 'Collection trouvée.' })
  @ApiResponse({ status: 404, description: 'Collection non trouvée.' })
  findOne(@Param('id') id: string) {
    return this.collectionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une collection par son ID' })
  @ApiParam({ name: 'id', description: 'ID de la collection' })
  @ApiResponse({ status: 200, description: 'Collection mise à jour avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 404, description: 'Collection non trouvée.' })
  update(@Param('id') id: string, @Body() updateCollectionDto: UpdateCollectionDto) {
    return this.collectionService.update(id, updateCollectionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une collection par son ID' })
  @ApiParam({ name: 'id', description: 'ID de la collection' })
  @ApiResponse({ status: 200, description: 'Collection supprimée avec succès.' })
  @ApiResponse({ status: 404, description: 'Collection non trouvée.' })
  remove(@Param('id') id: string) {
    return this.collectionService.remove(id);
  }
}
