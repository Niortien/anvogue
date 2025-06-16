import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';
import { PrismaService } from 'src/database/prisma.service';
import { Request } from 'express';
import { Utilisateur } from '@prisma/client';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crée un nouvel audit en liant l'utilisateur connecté et l'adresse IP
   * @param req Requête HTTP (utilisée pour récupérer l'utilisateur connecté)
   * @param ip Adresse IP du client
   * @param createAuditDto Données pour créer l'audit
   * @returns L'audit créé
   * @throws BadRequestException si la création échoue
   */
  async create(req: Request, ip: string, createAuditDto: CreateAuditDto) {
    const user = req.user as Utilisateur;

    const audit = await this.prisma.audit.create({
      data: {
        ...createAuditDto,
        utilisateur_id: user.id,
        ip,
      },
    });

    if (!audit) {
      throw new BadRequestException('Audit non créé');
    }

    return audit;
  }

  /**
   * Récupère tous les audits existants
   * @returns Une liste des audits
   * @throws BadRequestException si aucun audit n'est trouvé
   */
  async findAll() {
    const audits = await this.prisma.audit.findMany();

    if (!audits) {
      throw new BadRequestException('Aucun audit trouvé');
    }

    return audits;
  }

  /**
   * Récupère un audit spécifique par son identifiant
   * @param id Identifiant de l'audit
   * @returns L'audit correspondant
   * @throws BadRequestException si l'audit n'est pas trouvé
   */
  async findOne(id: string) {
    const audit = await this.prisma.audit.findUnique({
      where: { id },
    });

    if (!audit) {
      throw new BadRequestException('Audit non trouvé');
    }

    return audit;
  }

  /**
   * Met à jour un audit existant
   * @param id Identifiant de l'audit à mettre à jour
   * @param updateAuditDto Données de mise à jour
   * @returns L'audit mis à jour
   * @throws BadRequestException si l'audit n'est pas trouvé ou la mise à jour échoue
   */
  async update(id: string, updateAuditDto: UpdateAuditDto) {
    try {
      const audit = await this.prisma.audit.update({
        where: { id },
        data: updateAuditDto,
      });
      return audit;
    } catch (error) {
      throw new BadRequestException('Audit non trouvé ou mise à jour impossible');
    }
  }

  /**
   * Supprime un audit par son identifiant
   * @param id Identifiant de l'audit à supprimer
   * @returns L'audit supprimé
   * @throws BadRequestException si l'audit n'est pas trouvé ou la suppression échoue
   */
  async remove(id: string) {
    try {
      const audit = await this.prisma.audit.delete({
        where: { id },
      });
      return audit;
    } catch (error) {
      throw new BadRequestException('Audit non trouvé ou suppression impossible');
    }
  }
}
