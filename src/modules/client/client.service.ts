import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ClientService {
  constructor(private readonly prismaService: PrismaService) { }
  async create(createClientDto: CreateClientDto) {
    const client = await this.prismaService.client.create({
      data: createClientDto
    })
    if (!client) {
      throw new BadRequestException("Client non trouvé");
    }
    const { password, ...clientSansPassword } = client;

    return clientSansPassword
  }

  async findOneByEmail(email: string) {
    if (!email) {
      throw new BadRequestException("Email est requis");
    }
    const client = await this.prismaService.client.findUnique({
      where: { email }
    })
    return client

  }



  private readonly publicSelect = {
    id: true, nom: true, prenom: true, nomUtilisateur: true, email: true,
    phone: true, genre: true, adresse: true, date_naissance: true, avatar: true,
    createdAt: true, updatedAt: true,
  };

  findAll() {
    return this.prismaService.client.findMany({ select: this.publicSelect });
  }

  findOne(id: string) {
    return this.prismaService.client.findUnique({
      where: { id },
      select: this.publicSelect,
    });
  }

  update(id: string, updateClientDto: UpdateClientDto) {
    return this.prismaService.client.update(
      {
        where: { id },
        data: updateClientDto,
        select: this.publicSelect,
      }
    );
  }

  remove(id: string) {
    return this.prismaService.client.delete(
      {
        where: { id }
      }

    );
  }
}
