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

  findAll() {
    return this.prismaService.utilisateur.findMany();
  }

  findOne(id: string) {
    return this.prismaService.utilisateur.findUnique({
      where: { id },
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
