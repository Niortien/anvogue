import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';
import { PrismaService } from 'src/database/prisma.service';
import { Request } from 'express';
import { Utilisateur } from '@prisma/client';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {

  }
  create(req: Request, ip: string, createAuditDto: CreateAuditDto) {

    // Recuperation de l'utilisateur connecté
    const user = req.user as Utilisateur;

    const audit = this.prisma.audit.create({
      data: {
        ...createAuditDto,
        utilisateur_id: user.id,
        ip
      }
    });

    if (!audit) {
      throw new BadRequestException('Audit non cree');
    }

    return audit;
  }

  findAll() {
    const audit = this.prisma.audit.findMany();
    if (!audit) {
      throw new BadRequestException('Audit non trouve');
    }
    return audit;
  }

  findOne(id: string) {
    return this.prisma.audit.findUnique(
      {
        where: { id }
      }
    );
  }

  update(id: string, updateAuditDto: UpdateAuditDto) {
    const audit = this.prisma.audit.update(
      {
        where: { id },
        data: updateAuditDto
      }
    );
    if (!audit) {
      throw new BadRequestException('Audit non trouve');
    }
    return audit;
  }
  // je ne crois qu'on est besoin de mettre à jour un audit 
  remove(id: string) {
    const audit = this.prisma.audit.delete(
      {
        where: { id }
      }
    );;
  }
}
