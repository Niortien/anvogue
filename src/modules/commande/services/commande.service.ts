import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCommandeDto } from '../dto/create-commande.dto';
import { UpdateCommandeDto } from '../dto/update-commande.dto';

const commandeInclude = {
    lignes: { include: { article: true, variete: true } },
    client: {
        select: {
            id: true, nom: true, prenom: true, nomUtilisateur: true, email: true,
            phone: true, genre: true, adresse: true, date_naissance: true, avatar: true,
            createdAt: true, updatedAt: true,
        },
    },
    utilisateur: {
        select: {
            id: true, nomComplet: true, nomUtilisateur: true, email: true, role: true,
            date_naissance: true, genre: true, avatar: true, createdAt: true, updatedAt: true,
        },
    },
};

@Injectable()
export class CommandeService {
    constructor(private readonly prismaService: PrismaService) { }

    create(createCommandeDto: CreateCommandeDto) {
        const { clientId, utilisateurId, lignes, ...rest } = createCommandeDto;

        return this.prismaService.commande.create({
            data: {
                ...rest,
                reference: Date.now().toString(),
                client: { connect: { id: clientId } },
                utilisateur: utilisateurId ? { connect: { id: utilisateurId } } : undefined,
                lignes: {
                    create: lignes.map(({ articleId, varieteId, ...ligne }) => ({
                        ...ligne,
                        article: articleId ? { connect: { id: articleId } } : undefined,
                        variete: varieteId ? { connect: { id: varieteId } } : undefined,
                    })),
                },
            },
            include: commandeInclude,
        });
    }

    findAll() {
        return this.prismaService.commande.findMany({
            include: commandeInclude,
            orderBy: { date: 'desc' },
        });
    }

    findOne(id: string) {
        return this.prismaService.commande.findUnique({
            where: { id },
            include: commandeInclude,
        });
    }

    findByClientId(clientId: string) {
        return this.prismaService.commande.findMany({
            where: { client_id: clientId },
            include: commandeInclude,
            orderBy: { date: 'desc' },
        });
    }

    async update(id: string, updateCommandeDto: UpdateCommandeDto) {
        const existing = await this.prismaService.commande.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException('Commande non trouvée');
        }

        const { clientId, utilisateurId, lignes, ...rest } = updateCommandeDto;

        if (lignes) {
            await this.prismaService.ligneCommande.deleteMany({ where: { commande_id: id } });
        }

        return this.prismaService.commande.update({
            where: { id },
            data: {
                ...rest,
                client: clientId ? { connect: { id: clientId } } : undefined,
                utilisateur: utilisateurId ? { connect: { id: utilisateurId } } : undefined,
                lignes: lignes
                    ? {
                        create: lignes.map(({ articleId, varieteId, ...ligne }) => ({
                            ...ligne,
                            article: articleId ? { connect: { id: articleId } } : undefined,
                            variete: varieteId ? { connect: { id: varieteId } } : undefined,
                        })),
                    }
                    : undefined,
            },
            include: commandeInclude,
        });
    }

    remove(id: string) {
        return this.prismaService.commande.delete({ where: { id } });
    }
}
