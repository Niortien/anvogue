import { PrismaService } from 'src/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateVarieteDto } from '../dto/create-variete.dto';
import { UpdateVarieteDto } from '../dto/update-variete.dto';

@Injectable()
export class VarieteService {
  constructor(private readonly prismaService: PrismaService) { }

  create(createVarieteDto: CreateVarieteDto, imagePath?: string) {
    const { article_id, tailles, ...rest } = createVarieteDto;
    return this.prismaService.variete.create({
      data: {
        ...rest,
        reference: createVarieteDto.reference ?? Date.now().toString(),
        tailles: tailles as unknown as object,
        image: imagePath ? [imagePath] : [],
        article: { connect: { id: article_id } },
      },
    });
  }

  findAll() {
    return this.prismaService.variete.findMany({
      include: { article: true },
    });
  }

  findOne(id: string) {
    return this.prismaService.variete.findUnique({
      where: { id },
      include: { article: true },
    });
  }

  update(id: string, updateVarieteDto: UpdateVarieteDto, imagePath?: string) {
    const { article_id, tailles, ...rest } = updateVarieteDto;
    return this.prismaService.variete.update({
      where: { id },
      data: {
        ...rest,
        tailles: tailles ? (tailles as unknown as object) : undefined,
        image: imagePath ? [imagePath] : undefined,
        article: article_id ? { connect: { id: article_id } } : undefined,
      },
    });
  }

  remove(id: string) {
    return this.prismaService.variete.delete({
      where: { id },
    });
  }
}
