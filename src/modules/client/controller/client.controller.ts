import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientService } from './client.service';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
  @ApiOperation({summary:"creation d'un client"})
 
  @ApiOperation({summary:"Affiche tous les clients"})
  @Get()
  findAll() {
    return this.clientService.findAll();
  }

  @ApiOperation({summary:"Rechercher un client à partir de son id"})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }

  @ApiOperation({summary:"Mise à jour d'un client"})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(id, updateClientDto);
  }

  @ApiOperation({summary:"suppression d'un client"})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }
}
