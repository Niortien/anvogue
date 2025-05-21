import { Injectable } from '@nestjs/common';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UtilisateurService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createUtilisateurDto: CreateUtilisateurDto) {

    return this.prismaService.utilisateur.create({
       data:createUtilisateurDto
    });
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

  update(id: string, updateUtilisateurDto: UpdateUtilisateurDto) {
    return this.prismaService.utilisateur.update({
      where: { id },
      data: updateUtilisateurDto,
    });
  }

  remove(id: string) {
    return this.prismaService.utilisateur.delete({ where: { id } });
  }
}
