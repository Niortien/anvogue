import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Ip } from '@nestjs/common';
import { AuditService } from './audit.service';
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';
import { UserAuthGuard } from '../auth/guards/userAuth.guard';
import { Request } from 'express';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) { }

  @UseGuards(UserAuthGuard)
  @Post()
  create(@Req() req: Request, @Ip() ip: string, @Body() createAuditDto: CreateAuditDto) {
    return this.auditService.create(req, ip, createAuditDto);
  }

  @Get()
  findAll() {
    return this.auditService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auditService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuditDto: UpdateAuditDto) {
    return this.auditService.update(id, updateAuditDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auditService.remove(id);
  }
}
