import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { ApiOperation } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/modules/auth/guards/userAuth.guard';

@Controller('utilisateur')
@UseGuards(UserAuthGuard)
export class UtilisateurController {
  constructor(private readonly utilisateurService: UtilisateurService) { }

  @ApiOperation({ summary: 'Affiche tous les utilisateurs' })
  @Get()
  findAll() {
    return this.utilisateurService.findAll();
  }

  @ApiOperation({ summary: 'Affiche les utilisateurs en fonction de la recherche avec id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.utilisateurService.findOne(id);
  }

  @ApiOperation({ summary: "Mise à jour  de l'utilisateur" })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUtilisateurDto: UpdateUtilisateurDto) {
    return this.utilisateurService.update(id, updateUtilisateurDto);
  }

  @ApiOperation({ summary: "suppresion de l' utilisateur" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.utilisateurService.remove(id);
  }
}
