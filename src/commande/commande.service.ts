import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCommandeDto } from './dto/create-commande.dto';
import { UpdateCommandeDto } from './dto/update-commande.dto';
import { CommonService } from 'src/common/common.service';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';

type CommandeWithRelations = Prisma.CommandeGetPayload<{
  include: {
    lignes: {
      include: {
        variete: {
          include: {
            article: true;
          };
        };
        article: true;
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

  async create(createCommandeDto: CreateCommandeDto): Promise<CommandeWithRelations> {
    console.log('DTO reçu :', createCommandeDto);

    const count = await this.prismaService.commande.count();
    const reference = this.commonService.generateReference('CMD', count + 1);

    const { lignes, clientId, utilisateurId, ...commandeData } = createCommandeDto;

    // Vérification clientId non défini
    if (!clientId) {
      throw new BadRequestException('clientId est requis et doit être un UUID valide');
    }

    // Vérifier existence client
    const client = await this.prismaService.client.findUnique({ where: { id: clientId } });
    if (!client) throw new NotFoundException('Client introuvable');

    // Vérifier existence utilisateur si fourni
    if (utilisateurId) {
      const utilisateur = await this.prismaService.utilisateur.findUnique({ where: { id: utilisateurId } });
      if (!utilisateur) throw new NotFoundException('Utilisateur introuvable');
    }

    // Vérifier existence des articles et variétés dans les lignes
    for (const ligne of lignes) {
      if (ligne.varieteId) {
        const variete = await this.prismaService.variete.findUnique({ where: { id: ligne.varieteId } });
        if (!variete) throw new NotFoundException(`Variété introuvable : ${ligne.varieteId}`);
      }
      if (ligne.articleId) {
        const article = await this.prismaService.article.findUnique({ where: { id: ligne.articleId } });
        if (!article) throw new NotFoundException(`Article introuvable : ${ligne.articleId}`);
      }
    }

    // Création de la commande
    const commande = await this.prismaService.commande.create({
      data: {
        ...commandeData,
        clientId: clientId,
       utilisateurId: utilisateurId ?? null,
        date: new Date(),
        reference,
        lignes: {
          create: lignes.map((ligne) => ({
            quantite: ligne.quantite,
            prixUnitaire: ligne.prixUnitaire,
            taille: ligne.taille ?? null,
            couleur: ligne.couleur ?? null,
            article_id: ligne.articleId ?? undefined,
            variete_id: ligne.varieteId ?? undefined,
          })),
        },
      },
    });

    // Récupérer la commande complète avec relations
    const fullCommande = await this.prismaService.commande.findUnique({
      where: { id: commande.id },
      include: {
        lignes: {
          include: {
            variete: {
              include: {
                article: true,
              },
            },
            article: true,
          },
        },
        client: true,
        utilisateur: true,
      },
    });

    if (!fullCommande) {
      throw new NotFoundException('Commande créée introuvable');
    }

    return fullCommande;
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
            article: true,
          },
        },
        client: true,
        utilisateur: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async findByClientId(clientId: string): Promise<CommandeWithRelations[]> {
    return this.prismaService.commande.findMany({
      where: { clientId: clientId },
      include: {
        lignes: {
          include: {
            variete: {
              include: {
                article: true,
              },
            },
            article: true,
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
            article: true,
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
      // Supprimer les anciennes lignes
      await prisma.ligneCommande.deleteMany({ where: { commande_id: id } });

      // Mettre à jour la commande
      await prisma.commande.update({
        where: { id },
        data: commandeData,
      });

      // Créer les nouvelles lignes
      if (Array.isArray(lignes) && lignes.length > 0) {
        for (const ligne of lignes) {
          await prisma.ligneCommande.create({
            data: {
              commande_id: id,
              quantite: ligne.quantite,
              prixUnitaire: ligne.prixUnitaire,
              taille: ligne.taille ?? null,
              couleur: ligne.couleur ?? null,
              article_id: ligne.articleId ?? undefined,
              variete_id: ligne.varieteId ?? undefined,
            },
          });
        }
      }

      // Récupérer la commande complète mise à jour
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
              article: true,
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
