import { Injectable } from '@nestjs/common';
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma:PrismaService ){

  }
  create(createAuditDto: CreateAuditDto) {
    return this.prisma.audit.create({
      data:createAuditDto
    });
  }

  findAll() {
    return this.prisma.audit.findMany();
  }

  findOne(id: string) {
    return  this.prisma.audit.findUnique(
      {
        where:{id}
      }
    );
  }

  update(id: string, updateAuditDto: UpdateAuditDto) {
    return `This action updates a #${id} audit`;
  }
// je ne crois qu'on est besoin de mettre à jour un audit 
  remove(id: string) {
    return this.prisma.audit.delete(
      {
        where:{id}
      }
    );;
  }
}
