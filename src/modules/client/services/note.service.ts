import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';

@Injectable()
export class NoteService {
  constructor(private readonly prisma: PrismaService) {}

  create(createNoteDto: CreateNoteDto) {
    return this.prisma.note.create({
      data: createNoteDto,
    });
  }

  findAll() {
    return this.prisma.note.findMany({
      include: {
        client: true,
        article: true,
      },
    });
  }

  async findOne(id: string) {
    const note = await this.prisma.note.findUnique({
      where: { id },
      include: {
        client: true,
        article: true,
      },
    });

    if (!note) {
      throw new NotFoundException(`Note avec l'id ${id} introuvable.`);
    }

    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    // Vérifie d'abord que la note existe
    await this.findOne(id);

    return this.prisma.note.update({
      where: { id },
      data: updateNoteDto,
    });
  }

  async remove(id: string) {
    // Vérifie d'abord que la note existe
    await this.findOne(id);

    return this.prisma.note.delete({
      where: { id },
    });
  }
}
