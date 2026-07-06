import { PrismaService } from 'src/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from '../dto/create-collection.dto';
import { UpdateCollectionDto } from '../dto/update-collection.dto';

@Injectable()
export class CollectionService {
  constructor(private readonly prismaService: PrismaService) { }

  create(createCollectionDto: CreateCollectionDto) {
    return this.prismaService.collection.create({
      data: { ...createCollectionDto, reference: Date.now().toString() }
    });
  }

  findAll() {
    return this.prismaService.collection.findMany();
  }

  findOne(id: string) {
    return this.prismaService.collection.findUnique({
      where: { id }
    });
  }

  update(id: string, updateCollectionDto: UpdateCollectionDto) {
    return this.prismaService.collection.update({
      where: { id },
      data: updateCollectionDto,
    });
  }

  remove(id: string) {
    return this.prismaService.collection.delete({
      where: { id }
    });
  }
}
