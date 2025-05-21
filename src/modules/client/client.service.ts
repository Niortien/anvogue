import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ClientService {
  constructor (private readonly  prismaService:PrismaService){}
  create(createClientDto: CreateClientDto) {
    return 'This action adds a new client';
  }

  findAll() {
    return this.prismaService.client.findMany();
  }

  findOne(id: string) {
    return this.prismaService.client.findUnique(
{
  where:{id}
}

    );
  }

  update(id: string, updateClientDto: UpdateClientDto) {
    return this.prismaService.client.update(
      {where:{id},
    data:updateClientDto}
    );
  }

  remove(id: string) {
    return this.prismaService.client.delete(
{
  where:{id}
}

    );
  }
}
