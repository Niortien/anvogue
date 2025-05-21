import { PrismaService } from 'src/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(private readonly prismaService:PrismaService){}
  create(createArticleDto: CreateArticleDto) {
    return this.prismaService.article.create({
      data:createArticleDto
    });
  }

  findAll() {
    return this.prismaService.article.findMany() ;
  }

  findOne(id: string) {
    return this.prismaService.article.findUnique(
      {
        where:{id}
      }
    );
  }

  update(id: string, updateArticleDto: UpdateArticleDto) {
    return this.prismaService.article.update(
      {where:{id},data:updateArticleDto}
    );
  }

  remove(id: string) {
    return this.prismaService.article.delete(
      {
        where:{id}
      }
    );
  }
}
