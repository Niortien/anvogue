import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';


import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { FavorisService } from '../services/favoris.service';
import { CreateFavorisDto } from '../dto/create-favoris.dto';
import { UpdateFavorisDto } from '../dto/update-favoris.dto';

@ApiTags('favoris')
@Controller('favoris')
export class FavorisController {
  constructor(private readonly favorisService: FavorisService) {}

  @Post()
  @ApiOperation({ summary: 'Ajouter un article aux favoris' })
  @ApiCreatedResponse({ description: 'Favoris créé avec succès.' })
  @ApiBadRequestResponse({ description: 'Données invalides.' })
  @ApiConflictResponse({ description: 'Favoris déjà existant.' })
  create(@Body() createFavorisDto: CreateFavorisDto) {
    return this.favorisService.create(createFavorisDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les favoris' })
  @ApiOkResponse({ description: 'Liste des favoris récupérée avec succès.' })
  findAll() {
    return this.favorisService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un favoris par ID' })
  @ApiOkResponse({ description: 'Favoris trouvé.' })
  @ApiNotFoundResponse({ description: 'Favoris non trouvé.' })
  findOne(@Param('id') id: string) {
    return this.favorisService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un favoris par ID' })
  @ApiOkResponse({ description: 'Favoris mis à jour avec succès.' })
  @ApiBadRequestResponse({ description: 'Données invalides.' })
  @ApiNotFoundResponse({ description: 'Favoris non trouvé.' })
  update(@Param('id') id: string, @Body() updateFavorisDto: UpdateFavorisDto) {
    return this.favorisService.update(id, updateFavorisDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un favoris par ID' })
  @ApiOkResponse({ description: 'Favoris supprimé avec succès.' })
  @ApiNotFoundResponse({ description: 'Favoris non trouvé.' })
  remove(@Param('id') id: string) {
    return this.favorisService.remove(id);
  }
}
