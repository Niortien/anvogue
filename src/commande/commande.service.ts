import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommandeDto } from './dto/create-commande.dto';
import { UpdateCommandeDto } from './dto/update-commande.dto';
import { CommonService } from 'src/common/common.service';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma, Commande } from '@prisma/client';

type CommandeWithRelations = Prisma.CommandeGetPayload<{
  include: {
    lignes: {
      include: {
        variete: {
          include: {
            article: true;
          };
        };
      };
    };
    client: true;
    utilisateur: true;
  };
}>;

@Injectable()
export class CommandeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly commonService: CommonService,
  ) {}

  async create(createCommandeDto: CreateCommandeDto): Promise<Commande> {
    const count = await this.prismaService.commande.count();
    const reference = this.commonService.generateReference('CMD', count + 1);

    const { lignes, client_id, utilisateur_id, ...commandeData } = createCommandeDto;

    // Vérifie l'existence du client
    const client = await this.prismaService.client.findUnique({ where: { id: client_id } });
    if (!client) throw new NotFoundException('Client introuvable');

    // Vérifie l'existence de l'utilisateur si fourni
    if (utilisateur_id) {
      const utilisateur = await this.prismaService.utilisateur.findUnique({ where: { id: utilisateur_id } });
      if (!utilisateur) throw new NotFoundException('Utilisateur introuvable');
    }

    // Vérifie que toutes les variétés référencées existent
    for (const ligne of lignes) {
      if (ligne.varieteId) {
        const variete = await this.prismaService.variete.findUnique({ where: { id: ligne.varieteId } });
        if (!variete) throw new NotFoundException(`Variété introuvable : ${ligne.varieteId}`);
      }
    }

    const commande = await this.prismaService.commande.create({
      data: {
        ...commandeData,
        client_id,
        utilisateur_id,
        date: new Date(),
        reference,
        lignes: {
          create: lignes.map((ligne) => {
            const data: any = {
              quantite: ligne.quantite,
              prixUnitaire: ligne.prixUnitaire,
              taille: ligne.taille ?? null,
              couleur: ligne.couleur ?? null,
            };
            if (ligne.articleId) data.articleId = ligne.articleId;
            if (ligne.varieteId) data.varieteId = ligne.varieteId;
            return data;
          }),
        },
      },
    });

    return commande;
  }

  async findAll(): Promise<CommandeWithRelations[]> {
    return this.prismaService.commande.findMany({
      include: {
        lignes: {
          include: {
            variete: {
              include: {
                article: true,
              },
            },
          },
        },
        client: true,
        utilisateur: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string): Promise<CommandeWithRelations | null> {
    return this.prismaService.commande.findUnique({
      where: { id },
      include: {
        lignes: {
          include: {
            variete: {
              include: {
                article: true,
              },
            },
          },
        },
        client: true,
        utilisateur: true,
      },
    });
  }

  async update(id: string, updateCommandeDto: UpdateCommandeDto): Promise<CommandeWithRelations> {
    const { lignes, ...commandeData } = updateCommandeDto;

    return this.prismaService.$transaction(async (prisma) => {
      // Supprime les anciennes lignes
      await prisma.ligneCommande.deleteMany({ where: { commande_id: id } });

      // Met à jour la commande
      await prisma.commande.update({
        where: { id },
        data: commandeData,
      });

      // Recréé les lignes
      if (Array.isArray(lignes) && lignes.length > 0) {
        for (const ligne of lignes) {
          const data: any = {
            commande_id: id,
            quantite: ligne.quantite,
            prixUnitaire: ligne.prixUnitaire,
            taille: ligne.taille ?? null,
            couleur: ligne.couleur ?? null,
          };
          if (ligne.articleId) data.articleId = ligne.articleId;
          if (ligne.varieteId) data.varieteId = ligne.varieteId;

          await prisma.ligneCommande.create({ data });
        }
      }

      const fullCommande = await prisma.commande.findUnique({
        where: { id },
        include: {
          lignes: {
            include: {
              variete: {
                include: {
                  article: true,
                },
              },
            },
          },
          client: true,
          utilisateur: true,
        },
      });

      if (!fullCommande) {
        throw new NotFoundException('Commande mise à jour introuvable');
      }

      return fullCommande;
    });
  }

  async remove(id: string) {
    return this.prismaService.commande.delete({ where: { id } });
  }
}
