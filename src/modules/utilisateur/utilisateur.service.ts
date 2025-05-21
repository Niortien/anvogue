import { Injectable } from '@nestjs/common';
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
    return this.prismaService.utilisateur.findUnique({
      where: {
        email
      }
    })
  }
  findOneByNomUtilisateur(nomUtilisateur: string) {
    return this.prismaService.utilisateur.findUnique({
      where: {
        nomUtilisateur
      }
    })
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
