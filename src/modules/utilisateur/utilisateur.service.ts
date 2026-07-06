import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UtilisateurService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createUtilisateurDto: CreateUtilisateurDto) {
    const utilisateur = await this.prismaService.utilisateur.create({
      data: createUtilisateurDto
    });

    const { password, ...rest } = utilisateur;

    return rest;
  }

  private readonly publicSelect = {
    id: true, nomComplet: true, nomUtilisateur: true, email: true, role: true,
    date_naissance: true, genre: true, avatar: true, createdAt: true, updatedAt: true,
  };

  findAll() {
    return this.prismaService.utilisateur.findMany({ select: this.publicSelect });
  }

  findOne(id: string) {
    return this.prismaService.utilisateur.findUnique({
      where: { id },
      select: this.publicSelect,
    });
  }
  findOneByEmail(email: string) {
    if (!email) {
      throw new BadRequestException("Email est requis.");
    }
    const utilisateur = this.prismaService.utilisateur.findUnique({
      where: {
        email
      }
    });

    return utilisateur;
  }


  findOneByNomUtilisateur(nomUtilisateur: string) {
    if (!nomUtilisateur) {
      throw new BadRequestException("Nom d'utilisateur est requis.");
    }
    const utilisateur = this.prismaService.utilisateur.findUnique({
      where: {
        nomUtilisateur
      }
    })

    return utilisateur;
  }

  async update(id: string, updateUtilisateurDto: UpdateUtilisateurDto) {
    const utilisateur = await this.prismaService.utilisateur.update({
      where: { id },
      data: updateUtilisateurDto,
    });

    const { password, ...rest } = utilisateur;

    return rest;
  }

  remove(id: string) {
    return this.prismaService.utilisateur.delete({ where: { id } });
  }
}