import { PrismaService } from 'src/database/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { QueryArticleDto, QueryArticleResponseDto } from '../dto/query-article.dto';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class ArticleService {
  constructor(private readonly prismaService: PrismaService, private readonly commonService: CommonService) { }
  async create(createArticleDto: CreateArticleDto) {
    const count = await this.prismaService.article.count();
    const article = await this.prismaService.article.create({
      data: { ...createArticleDto, reference: this.commonService.generateReference('ART', count + 1) },
      include: {
        varietes: true
      }
    });
    if (!article) {
      throw new BadRequestException('Article non cree');
    }
    return article;
  }

  async findAll(query: QueryArticleDto): Promise<QueryArticleResponseDto> {
    const {
      search,
      categorie,
      collection,
      couleur,
      taille,
      genre,
      reference,
      nom,
      quantite,
      prix,
      prix_start,
      prix_end,
      estEnPromotion,
      type,
      page = '1',
      limit = '10' } = query;

    const where: any = {

    }
    if (search) {
      where.OR = [
        {
          reference: {
            contains: search
          }
        },
        {
          nom: {
            contains: search
          }
        },
        {
          description: {
            contains: search
          }
        }
      ]
    }
    if (reference) {
      where.reference = {
        contains: reference
      }
    }
    if (nom) {
      where.nom = {
        contains: nom
      }
    }
    if (quantite) {
      where.quantite = {
        contains: Number(quantite)
      }
    }
    if (prix) {
      where.prix = {
        contains: Number(prix)
      }
    }
    if (prix_start) {
      where.prix = {
        gte: Number(prix_start)
      }
    }
    if (prix_end) {
      where.prix = {
        lte: Number(prix_end)
      }
    }
    if (estEnPromotion) {
      where.estEnPromotion = {
        contains: estEnPromotion
      }
    }
    if (type) {
      where.type = {
        contains: type
      }
    }
    if (genre) {
      where.genre = {
        contains: genre
      }
    }
    if (categorie) {
      where.categorie = {
        contains: categorie
      }
    }
    if (collection) {
      where.collection = {
        contains: collection
      }
    }
    if (couleur) {
      where.couleur = {
        contains: couleur
      }
    }
    if (taille) {
      where.taille = {
        contains: taille
      }
    }
    const articles = await this.prismaService.article.findMany({
      where,
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      include: {
        varietes: true,
        categorie: true,
        collection: true
      }
    });

    return {
      data: articles,
      total: articles.length,
      page: Number(page),
      limit: Number(limit)
    }
  }

  async findOne(id: string) {
    const article = await this.prismaService.article.findUnique(
      {
        where: { id }
      }
    );
    if (!article) {
      throw new BadRequestException('Article non trouve');
    }
    return article;
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    const article = await this.prismaService.article.update(
      { where: { id }, data: updateArticleDto }
    );
    if (!article) {
      throw new BadRequestException('Article non trouve');
    }
    return article;
  }

  async remove(id: string) {
    const article = await this.prismaService.article.delete(
      {
        where: { id }
      }
    );

    if (!article) {
      throw new BadRequestException('Article non trouve');
    }
    return article;
  }
}
