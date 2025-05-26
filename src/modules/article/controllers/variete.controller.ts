import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VarieteService } from '../services/variete.service';
import { CreateVarieteDto } from '../dto/create-variete.dto';
import { UpdateVarieteDto } from '../../../variete/dto/update-variete.dto';

@Controller('variete')
export class VarieteController {
  constructor(private readonly varieteService: VarieteService) {}

  @Post()
  create(@Body() createVarieteDto: CreateVarieteDto) {
    return this.varieteService.create(createVarieteDto);
  }

  @Get()
  findAll() {
    return this.varieteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.varieteService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVarieteDto: UpdateVarieteDto) {
    return this.varieteService.update(id, updateVarieteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.varieteService.remove(id);
  }
}
