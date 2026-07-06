import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateCollectionDto } from '../dto/create-collection.dto';
import { UpdateCollectionDto } from '../dto/update-collection.dto';
import { CollectionService } from '../services/collection.service';
import { UserAuthGuard } from 'src/modules/auth/guards/userAuth.guard';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) { }

  @ApiOperation({ summary: "creation d'une collection" })
  @UseGuards(UserAuthGuard)
  @Post()
  create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionService.create(createCollectionDto);
  }

  @ApiOperation({ summary: "Affichage de toutes les collections" })
  @Get()
  findAll() {
    return this.collectionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: "Affichage d'une collection à partir de son id" })
  findOne(@Param('id') id: string) {
    return this.collectionService.findOne(id);
  }

  @UseGuards(UserAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: "Mise à jour d'une collection" })
  update(@Param('id') id: string, @Body() updateCollectionDto: UpdateCollectionDto) {
    return this.collectionService.update(id, updateCollectionDto);
  }

  @UseGuards(UserAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: "suppression d'une collection à partir de son id" })
  remove(@Param('id') id: string) {
    return this.collectionService.remove(id);
  }
}
