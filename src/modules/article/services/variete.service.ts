import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateVarieteDto } from '../dto/create-variete.dto';
import { UpdateVarieteDto } from '../dto/update-variete.dto';
import { PrismaService } from 'src/database/prisma.service';
import { CommonService } from 'src/common/common.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class VarieteService {
  private readonly logger = new Logger(VarieteService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly commonService: CommonService,
  ) {}

  private serializeVariete(variete: any) {
    return {
      ...variete,
      tailles:
        typeof variete.tailles === 'object'
          ? variete.tailles
          : (variete.tailles ? JSON.parse(variete.tailles) : []),
    };
  }

  async create(createVarieteDto: CreateVarieteDto) {
    try {
      this.logger.debug('Création d’une variété :', createVarieteDto);

      const article = await this.prisma.article.findUnique({
        where: { id: createVarieteDto.article_id },
      });

      if (!article) {
        throw new BadRequestException(
          `L'article avec l'ID ${createVarieteDto.article_id} n'existe pas.`,
        );
      }

      if (
        createVarieteDto.tailles &&
        !Array.isArray(createVarieteDto.tailles)
      ) {
        throw new BadRequestException(
          `Le champ "tailles" doit être un tableau.`,
        );
      }

      const count = await this.prisma.variete.count();
      const reference = this.commonService.generateReference('Var', count + 1);

      const variete = await this.prisma.variete.create({
        data: {
          couleur: createVarieteDto.couleur,
          image: createVarieteDto.image ?? '',
          article_id: createVarieteDto.article_id,
      tailles: createVarieteDto.tailles as unknown as Prisma.InputJsonValue,
          reference,
        },
        include: {
          article: true,
        },
      });

      this.logger.debug(`Variété créée avec ID : ${variete.id}`);
      return this.serializeVariete(variete);
    } catch (error) {
      this.logger.error('Erreur lors de la création de la variété', error);

      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Erreur de contrainte de clé étrangère : vérifie l\'article lié.',
        );
      }

      throw error;
    }
  }

  async findAll() {
    const varietes = await this.prisma.variete.findMany({
      include: { article: true },
     
    });

    if (!varietes || varietes.length === 0) {
      throw new NotFoundException('Aucune variété trouvée.');
    }

    return varietes.map((v) => this.serializeVariete(v));
  }

  async findOne(id: string) {
    const variete = await this.prisma.variete.findUnique({
      where: { id },
      include: { article: true },
    });

    if (!variete) {
      throw new NotFoundException(`Variété avec l'ID ${id} introuvable.`);
    }

    return this.serializeVariete(variete);
  }

  async update(id: string, updateVarieteDto: UpdateVarieteDto) {
    try {
      const existingVariete = await this.prisma.variete.findUnique({
        where: { id },
      });

      if (!existingVariete) {
        throw new NotFoundException(`Variété avec l'ID ${id} introuvable.`);
      }

      if (
        updateVarieteDto.tailles &&
        !Array.isArray(updateVarieteDto.tailles)
      ) {
        throw new BadRequestException(
          `Le champ "tailles" doit être un tableau.`,
        );
      }

      const updated = await this.prisma.variete.update({
        where: { id },
        data: {
          ...updateVarieteDto,
          tailles: updateVarieteDto.tailles as unknown as Prisma.InputJsonValue,
        },
        include: { article: true },
      });

      return this.serializeVariete(updated);
    } catch (error) {
      this.logger.error('Erreur lors de la mise à jour de la variété', error);

      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Erreur de contrainte de clé étrangère.',
        );
      }

      throw error;
    }
  }

  async remove(id: string) {
    try {
      const deleted = await this.prisma.variete.delete({
        where: { id },
      });

      return this.serializeVariete(deleted);
    } catch (error) {
      this.logger.error('Erreur lors de la suppression de la variété', error);

      if (error.code === 'P2025') {
        throw new BadRequestException(
          `Variété avec l'ID ${id} introuvable pour suppression.`,
        );
      }

      throw error;
    }
  }
}
