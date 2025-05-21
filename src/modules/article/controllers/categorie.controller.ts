import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateCategorieDto } from '../dto/create-categorie.dto';
import { CategorieService } from '../services/categorie.service';

@Controller('categorie')
export class CategorieController {
  constructor(private readonly categorieService: CategorieService) { }
  @ApiOperation({ summary: "creation d'une categorie" })

  @Post()
  create(@Body() createCategorieDto: CreateCategorieDto) {
    return this.categorieService.create(createCategorieDto);
  }

  @ApiOperation({ summary: "Affichage de toutes les categories" })
  @Get()
  findAll() {
    return this.categorieService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: "Affichage d'une categorie à partir de son id" })
  findOne(@Param('id') id: string) {
    return this.categorieService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: "suppression d'une categorie à partir de son id" })
  remove(@Param('id') id: string) {
    return this.categorieService.remove(id);
  }
}
