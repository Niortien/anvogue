import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { CommandeService } from '../services/commande.service';
import { CreateCommandeDto } from '../dto/create-commande.dto';
import { UpdateCommandeDto } from '../dto/update-commande.dto';
import { UserAuthGuard } from 'src/modules/auth/guards/userAuth.guard';
import { ClientAuthGuard } from 'src/modules/auth/guards/clientAuth.guard';

@Controller('commande')
export class CommandeController {
    constructor(private readonly commandeService: CommandeService) { }

    @ApiOperation({ summary: "création d'une commande (client)" })
    @UseGuards(ClientAuthGuard)
    @Post()
    create(@Body() createCommandeDto: CreateCommandeDto) {
        return this.commandeService.create(createCommandeDto);
    }

    @ApiOperation({ summary: "Affichage de toutes les commandes (staff)" })
    @UseGuards(UserAuthGuard)
    @Get()
    findAll() {
        return this.commandeService.findAll();
    }

    @ApiOperation({ summary: "Affichage des commandes d'un client (le client lui-même)" })
    @UseGuards(ClientAuthGuard)
    @Get('client/:clientId')
    findByClientId(@Param('clientId') clientId: string, @Req() req: Request) {
        if ((req.user as { id: string })?.id !== clientId) {
            throw new ForbiddenException("Vous ne pouvez consulter que vos propres commandes");
        }
        return this.commandeService.findByClientId(clientId);
    }

    @ApiOperation({ summary: "Affichage d'une commande à partir de son id (staff)" })
    @UseGuards(UserAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.commandeService.findOne(id);
    }

    @ApiOperation({ summary: "Mise à jour d'une commande (staff)" })
    @UseGuards(UserAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCommandeDto: UpdateCommandeDto) {
        return this.commandeService.update(id, updateCommandeDto);
    }

    @ApiOperation({ summary: "suppression d'une commande à partir de son id (staff)" })
    @UseGuards(UserAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.commandeService.remove(id);
    }
}
