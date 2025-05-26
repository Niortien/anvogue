import { Injectable } from '@nestjs/common';
import { CreateFavorisDto } from './dto/create-favoris.dto';
import { UpdateFavorisDto } from './dto/update-favoris.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class FavorisService {
   constructor(private readonly prisma:PrismaService ){
  
    }
  create(createFavorisDto: CreateFavorisDto) {
    return this.prisma.favoris.create({
      data:createFavorisDto
    });
  }

  findAll() {
    return this.prisma.favoris.findMany({

    })
  }

  findOne(id: string) {
    return `This action returns a #${id} favoris`;
  }

  update(id: string, updateFavorisDto: UpdateFavorisDto) {
    return `This action updates a #${id} favoris`;
  }

  remove(id: string) {
    return this.prisma.favoris.delete({where:{id}})
  }
}
