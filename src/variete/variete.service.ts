import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVarieteDto } from './dto/create-variete.dto';
import { UpdateVarieteDto } from './dto/update-variete.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class VarieteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVarieteDto: CreateVarieteDto) {
    return await this.prisma.variete.create({
      data: createVarieteDto,
    });
  }

  async findAll() {
    return await this.prisma.variete.findMany();
  }

  async findOne(id: string) {
    const variete = await this.prisma.variete.findUnique({
      where: { id },
    });
    if (!variete) {
      throw new NotFoundException(`Variete avec l'id ${id} introuvable.`);
    }
    return variete;
  }

  async update(id: string, updateVarieteDto: UpdateVarieteDto) {
    await this.findOne(id); // vérifier existence avant update
    return await this.prisma.variete.update({
      where: { id },
      data: updateVarieteDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // vérifier existence avant suppression
    return await this.prisma.variete.delete({
      where: { id },
    });
  }
}
