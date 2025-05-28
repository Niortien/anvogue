import { PrismaService } from 'src/database/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategorieDto } from '../dto/create-categorie.dto';
import { UpdateCategorieDto } from '../dto/update-categorie.dto';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class CategorieService {
  constructor(private readonly prismaService: PrismaService, private readonly commonService: CommonService) { }

  async create(createCategorieDto: CreateCategorieDto) {
    const count = await this.prismaService.categorie.count();
    const existCategorie = await this.prismaService.categorie.findFirst({
      where: {
        nom: createCategorieDto.nom
      }
    });

    if (existCategorie) {
      throw new BadRequestException('Categorie deja existante');
    }

    const categorie = await this.prismaService.categorie.create({
      data: { ...createCategorieDto, reference: this.commonService.generateReference('CAT', count + 1) }
    });

    if (!categorie) {
      throw new BadRequestException('Categorie non cree');
    }
    return categorie;
  }

  async findAll() {
    const categories = await this.prismaService.categorie.findMany({
      include: {
        articles: true
      }
    });

    if (!categories) {
      throw new BadRequestException('Categories non trouvees');
    }
    return categories;
  }

  async findOne(id: string) {
    const categorie = await this.prismaService.categorie.findUnique(
      {
        where: { id },
        include: {
          articles: true
        }
      }
    );

    if (!categorie) {
      throw new BadRequestException('Categorie non trouvee');
    }
    return categorie;
  }

  async update(id: string, updateCategorieDto: UpdateCategorieDto) {
    const categorie = await this.prismaService.categorie.update(
      {
        where: { id },
        data: updateCategorieDto,
        include: {
          articles: true
        }
      }
    );

    if (!categorie) {
      throw new BadRequestException('Categorie non trouvee');
    }
    return categorie;
  }


  async remove(id: string) {
    const categorie = await this.prismaService.categorie.delete(
      {
        where: { id }
      }
    );

    if (!categorie) {
      throw new BadRequestException('Categorie non trouvee');
    }
    return categorie;
  }
}
