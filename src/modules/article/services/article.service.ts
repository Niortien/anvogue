import { PrismaService } from 'src/database/prisma.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { QueryArticleDto, QueryArticleResponseDto } from '../dto/query-article.dto';
import { CommonService } from 'src/common/common.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly commonService: CommonService
  ) {}

  private serializeArticle(article: any) {
    return {
      ...article,
      infos: typeof article.infos === 'object'
        ? article.infos
        : (article.infos ? JSON.parse(article.infos) : []),
    };
  }

  async create(createArticleDto: CreateArticleDto) {
    try {
      this.logger.debug('Creating article with data:', JSON.stringify(createArticleDto, null, 2));
       
      const categorie = await this.prismaService.categorie.findUnique({
        where: { id: createArticleDto.categorie_id },
      });

      if (!categorie) {
        const availableCategories = await this.prismaService.categorie.findMany({
          select: { id: true, nom: true },
          take: 5,
        });

        this.logger.debug('Available categories:', availableCategories);
        throw new BadRequestException(
          `La catégorie avec l'ID ${createArticleDto.categorie_id} n'existe pas`
        );
      }

      if (createArticleDto.collection_id) {
        const collection = await this.prismaService.collection.findUnique({
          where: { id: createArticleDto.collection_id },
        });

        if (!collection) {
          const availableCollections = await this.prismaService.collection.findMany({
            select: { id: true, nom: true },
            take: 5,
          });

          this.logger.debug('Available collections:', availableCollections);
          throw new BadRequestException(
            `La collection avec l'ID ${createArticleDto.collection_id} n'existe pas`
          );
        }
      }

      const count = await this.prismaService.article.count();
      const reference = this.commonService.generateReference('ART', count + 1);
      if (createArticleDto.infos && !Array.isArray(createArticleDto.infos)) {
  throw new BadRequestException(`Le champ "infos" doit être un tableau`);
}
      const article = await this.prismaService.article.create({
       
        data: {
          ...createArticleDto,
        infos: (createArticleDto.infos ?? []) as unknown as Prisma.InputJsonValue,
          reference,
        },
        include: {
          varietes: true,
          categorie: true,
          collection: true,
        },
      });

      if (!article) {
        throw new BadRequestException('Article non créé');
      }

      this.logger.debug(`Article created successfully with ID: ${article.id}`);
      return this.serializeArticle(article);

    } catch (error) {
      this.logger.error('Error creating article:', error);

      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Erreur de contrainte de clé étrangère. Vérifiez que la catégorie et la collection existent.'
        );
      }

      throw error;
    }
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
      limit = '10',
    } = query;

    const where: any = {};

    if (search) {
      where.OR = [
        { reference: { contains: search, mode: 'insensitive' } },
        { nom: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (reference) {
      where.reference = { contains: reference, mode: 'insensitive' };
    }

    if (nom) {
      where.nom = { contains: nom, mode: 'insensitive' };
    }

    if (quantite) {
      where.quantite = Number(quantite);
    }

    if (prix) {
      where.prix = Number(prix);
    }

    if (prix_start && prix_end) {
      where.prix = { gte: Number(prix_start), lte: Number(prix_end) };
    } else if (prix_start) {
      where.prix = { gte: Number(prix_start) };
    } else if (prix_end) {
      where.prix = { lte: Number(prix_end) };
    }

    if (estEnPromotion !== undefined) {
      where.estEnPromotion = estEnPromotion === 'true';
    }

    if (genre) {
      where.genre = genre;
    }

    if (categorie) {
      where.categorie = {
        nom: { contains: categorie, mode: 'insensitive' },
      };
    }

    if (collection) {
      where.collection = {
        nom: { contains: collection, mode: 'insensitive' },
      };
    }

    if (couleur || taille) {
      where.varietes = {
        some: {
          ...(couleur && { couleur: { contains: couleur, mode: 'insensitive' } }),
          ...(taille && { taille: { contains: taille, mode: 'insensitive' } }),
        },
      };
    }

    const totalCount = await this.prismaService.article.count({ where });

    const articles = await this.prismaService.article.findMany({
      where,
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      include: {
        varietes: true,
        categorie: true,
        collection: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const serializedArticles = articles.map((a) => this.serializeArticle(a));

    return {
      data: serializedArticles,
      total: totalCount,
      page: Number(page),
      limit: Number(limit),
    };
  }

  async findOne(id: string) {
    const article = await this.prismaService.article.findUnique({
      where: { id },
      include: {
        varietes: true,
        categorie: true,
        collection: true,
        notes: true,
        favoris: true,
      },
    });

    if (!article) {
      throw new BadRequestException('Article non trouvé');
    }

    return this.serializeArticle(article);
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    try {
      const existingArticle = await this.prismaService.article.findUnique({
        where: { id },
      });

      if (!existingArticle) {
        throw new BadRequestException('Article non trouvé');
      }

      if (updateArticleDto.categorie_id) {
        const categorie = await this.prismaService.categorie.findUnique({
          where: { id: updateArticleDto.categorie_id },
        });

        if (!categorie) {
          throw new BadRequestException(
            `La catégorie avec l'ID ${updateArticleDto.categorie_id} n'existe pas`
          );
        }
      }

      if (updateArticleDto.collection_id) {
        const collection = await this.prismaService.collection.findUnique({
          where: { id: updateArticleDto.collection_id },
        });

        if (!collection) {
          throw new BadRequestException(
            `La collection avec l'ID ${updateArticleDto.collection_id} n'existe pas`
          );
        }
      }

      const dataToUpdate: Prisma.ArticleUpdateInput = {
        ...updateArticleDto,
        infos: updateArticleDto.infos as unknown as Prisma.InputJsonValue,
      };

      const article = await this.prismaService.article.update({
        where: { id },
        data: dataToUpdate,
        include: {
          varietes: true,
          categorie: true,
          collection: true,
        },
      });

      return this.serializeArticle(article);

    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Erreur de contrainte de clé étrangère lors de la mise à jour'
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const article = await this.prismaService.article.delete({
        where: { id },
      });

      return this.serializeArticle(article);

    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException('Article non trouvé');
      }
      throw error;
    }
  }
}
