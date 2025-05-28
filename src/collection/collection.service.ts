import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { PrismaService } from 'src/database/prisma.service';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class CollectionService {
  constructor(private readonly prisma: PrismaService, private readonly commonService: CommonService) { }
  async create(createCollectionDto: CreateCollectionDto) {
    const count = await this.prisma.collection.count();
    const collection = await this.prisma.collection.create({
      data: { ...createCollectionDto, reference: this.commonService.generateReference('COL', count + 1) }
    });
    if (!collection) {
      throw new BadRequestException('Collection non cree');
    }

    return collection;
  }

  findAll() {
    const collection = this.prisma.collection.findMany(

    );
    if (!collection) {
      throw new BadRequestException('Collection non trouve');
    }
    return collection;
  }

  findOne(id: string) {
    const collection = this.prisma.collection.findUnique({
      where: { id }
    });
    if (!collection) {
      throw new BadRequestException('Collection non trouve');
    }
    return collection;
  }

  update(id: string, updateCollectionDto: UpdateCollectionDto) {
    const collection = this.prisma.collection.update({
      where: { id },
      data: updateCollectionDto
    });
    if (!collection) {
      throw new BadRequestException('Collection non trouve');
    }
    return collection;
  }

  remove(id: string) {
    const collection = this.prisma.collection.delete({
      where: { id }
    });
    if (!collection) {
      throw new BadRequestException('Collection non trouve');
    }
    return collection;
  }
}
