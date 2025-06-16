import { 
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Ip 
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';
import { UserAuthGuard } from '../auth/guards/userAuth.guard';
import { Request } from 'express';

import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('audit')
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @UseGuards(UserAuthGuard)
  @ApiBearerAuth() // indique que ce endpoint nécessite une authentification (JWT / Bearer)
  @Post()
  @ApiOperation({ summary: 'Créer un nouvel audit' })
  @ApiResponse({ status: 201, description: 'Audit créé avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides ou erreur de création.' })
  create(@Req() req: Request, @Ip() ip: string, @Body() createAuditDto: CreateAuditDto) {
    return this.auditService.create(req, ip, createAuditDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister tous les audits' })
  @ApiResponse({ status: 200, description: 'Liste des audits retournée avec succès.' })
  findAll() {
    return this.auditService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un audit par son ID' })
  @ApiResponse({ status: 200, description: 'Audit trouvé.' })
  @ApiResponse({ status: 404, description: 'Audit non trouvé.' })
  findOne(@Param('id') id: string) {
    return this.auditService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un audit existant' })
  @ApiResponse({ status: 200, description: 'Audit mis à jour.' })
  @ApiResponse({ status: 404, description: 'Audit non trouvé.' })
  update(@Param('id') id: string, @Body() updateAuditDto: UpdateAuditDto) {
    return this.auditService.update(id, updateAuditDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un audit par son ID' })
  @ApiResponse({ status: 200, description: 'Audit supprimé.' })
  @ApiResponse({ status: 404, description: 'Audit non trouvé.' })
  remove(@Param('id') id: string) {
    return this.auditService.remove(id);
  }
}
 