import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVarieteDto } from '../dto/create-variete.dto';
import { UpdateVarieteDto } from '../dto/update-variete.dto';
import { PrismaService } from 'src/database/prisma.service';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class VarieteService {
  constructor(private readonly prisma: PrismaService, private readonly commonService: CommonService) { }

  async create(createVarieteDto: CreateVarieteDto) {
    const count = await this.prisma.variete.count();

    return await this.prisma.variete.create({
      data: {
        ...createVarieteDto,
        reference: this.commonService.generateReference('VAR', count + 1)
      },
    });
  }

  async findAll() {
    const varietes = await this.prisma.variete.findMany({
      include: {
        article: true,
      },
    });
    if (!varietes) {
      throw new NotFoundException('Aucune variete trouvée.');
    }
    return varietes.map((variete) => ({
      ...variete,
      tailles: JSON.parse(variete?.tailles as string || '[]'),
    }));
  }

  async findOne(id: string) {
    const variete = await this.prisma.variete.findUnique({
      where: { id },
      include: {
        article: true,
      },
    });
    if (!variete) {
      throw new NotFoundException(`Variete avec l'id ${id} introuvable.`);
    }
    return {
      ...variete,
      tailles: JSON.parse(variete?.tailles as string || '[]'),
    };
  }

  async update(id: string, updateVarieteDto: UpdateVarieteDto) {
    await this.findOne(id);
    const variete = await this.prisma.variete.update({
      where: { id },
      data: {
        ...updateVarieteDto,
      },
    });
    return {
      ...variete,
      tailles: JSON.parse(variete?.tailles as string || '[]'),
    };
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.variete.delete({
      where: { id },
    });
  }
}

