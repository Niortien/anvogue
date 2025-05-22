import { PrismaService } from 'src/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateCategorieDto } from '../dto/create-categorie.dto';

@Injectable()
export class CategorieService {
  constructor(private readonly prismaService: PrismaService) { }
  create(createCategorieDto: CreateCategorieDto) {
    return this.prismaService.categorie.create({
      data: { ...createCategorieDto, reference: Date.now().toString() }
    });
  }

  findAll() {
    return this.prismaService.categorie.findMany();
  }

  findOne(id: string) {
    return this.prismaService.categorie.findUnique(
      {
        where: { id }
      }
    );
  }

  remove(id: string) {
    return this.prismaService.categorie.delete(
      {
        where: { id }
      }
    );
  }
}
