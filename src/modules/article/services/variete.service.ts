import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVarieteDto } from '../dto/create-variete.dto';
import { UpdateVarieteDto } from '../dto/update-variete.dto';
import { PrismaService } from 'src/database/prisma.service';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class VarieteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly commonService: CommonService,
  ) {}

  /**
   * Crée une nouvelle variété.
   * Génère une référence unique basée sur le nombre actuel d'enregistrements.
   * @param createVarieteDto DTO contenant les données de la variété.
   * @returns La variété créée.
   */
  async create(createVarieteDto: CreateVarieteDto) {
    const count = await this.prisma.variete.count();

    return await this.prisma.variete.create({
      data: {
        ...createVarieteDto,
        reference: this.commonService.generateReference('VAR', count + 1),
      },
    });
  }

  /**
   * Récupère toutes les variétés, avec les articles associés.
   * Parse le champ JSON "tailles" avant de retourner.
   * @returns Liste des variétés.
   * @throws NotFoundException si aucune variété n'est trouvée.
   */
  async findAll() {
    const varietes = await this.prisma.variete.findMany({
      include: { article: true },
    });

    if (!varietes || varietes.length === 0) {
      throw new NotFoundException('Aucune variété trouvée.');
    }

    return varietes.map((variete) => ({
      ...variete,
      tailles: JSON.parse(variete?.tailles as string || '[]'),
    }));
  }

  /**
   * Récupère une variété par son ID, avec l'article associé.
   * Parse le champ JSON "tailles".
   * @param id Identifiant de la variété.
   * @returns La variété correspondante.
   * @throws NotFoundException si la variété n'existe pas.
   */
  async findOne(id: string) {
    const variete = await this.prisma.variete.findUnique({
      where: { id },
      include: { article: true },
    });

    if (!variete) {
      throw new NotFoundException(`Variété avec l'id ${id} introuvable.`);
    }

    return {
      ...variete,
      tailles: JSON.parse(variete?.tailles as string || '[]'),
    };
  }

  /**
   * Met à jour une variété existante.
   * Vérifie que la variété existe avant mise à jour.
   * @param id Identifiant de la variété.
   * @param updateVarieteDto Données de mise à jour.
   * @returns La variété mise à jour.
   */
  async update(id: string, updateVarieteDto: UpdateVarieteDto) {
    await this.findOne(id); // Vérification d'existence

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

  /**
   * Supprime une variété par son ID.
   * Vérifie que la variété existe avant suppression.
   * @param id Identifiant de la variété.
   * @returns La variété supprimée.
   */
  async remove(id: string) {
    await this.findOne(id); // Vérification d'existence

    return await this.prisma.variete.delete({
      where: { id },
    });
  }
}
