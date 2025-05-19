import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('utilisateur')
export class UtilisateurController {
  constructor(private readonly utilisateurService: UtilisateurService) {}
  

  @Post()
  create(@Body() createUtilisateurDto: CreateUtilisateurDto) {

    
    return this.utilisateurService.create(createUtilisateurDto);
    // la creatio d'un user est commenté car le user est créé par le service d'authentification
  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  }

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
