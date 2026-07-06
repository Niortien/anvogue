import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { ClientService } from './client.service';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiOperation } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/modules/auth/guards/userAuth.guard';
import { ClientAuthGuard } from 'src/modules/auth/guards/clientAuth.guard';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @ApiOperation({summary:"Affiche tous les clients (staff)"})
  @UseGuards(UserAuthGuard)
  @Get()
  findAll() {
    return this.clientService.findAll();
  }

  @ApiOperation({summary:"Affiche le client actuellement connecté"})
  @UseGuards(ClientAuthGuard)
  @Get('me')
  findMe(@Req() req: Request) {
    return req.user;
  }

  @ApiOperation({summary:"Rechercher un client à partir de son id (staff)"})
  @UseGuards(UserAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }

  @ApiOperation({summary:"Mise à jour d'un client (staff)"})
  @UseGuards(UserAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(id, updateClientDto);
  }

  @ApiOperation({summary:"suppression d'un client (staff)"})
  @UseGuards(UserAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }
}
