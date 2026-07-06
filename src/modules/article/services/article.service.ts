import { PrismaService } from 'src/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(private readonly prismaService: PrismaService) { }
  create(createArticleDto: CreateArticleDto) {
    return this.prismaService.article.create({
      data: { ...createArticleDto, reference: Date.now().toString() }
    });
  }

  findAll() {
    return this.prismaService.article.findMany({
      include: { varietes: true, favoris: true, categorie: true, collection: true },
    });
  }

  findOne(id: string) {
    return this.prismaService.article.findUnique(
      {
        where: { id },
        include: { varietes: true, favoris: true, notes: true, categorie: true, collection: true },
      }
    );
  }

  update(id: string, updateArticleDto: UpdateArticleDto) {
    return this.prismaService.article.update(
      { where: { id }, data: updateArticleDto }
    );
  }

  remove(id: string) {
    return this.prismaService.article.delete(
      {
        where: { id }
      }
    );
  }
}
