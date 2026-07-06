import { Controller, Get, Post, Body, Param, Patch, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateVarieteDto } from '../dto/create-variete.dto';
import { UpdateVarieteDto } from '../dto/update-variete.dto';
import { VarieteService } from '../services/variete.service';
import { UserAuthGuard } from 'src/modules/auth/guards/userAuth.guard';
import { toWebPath } from 'src/common/file-path.util';

const imageUploadOptions = {
  storage: diskStorage({
    destination: './uploads/varietes',
    filename: (req, file, callback) => {
      const filename = `image-${Date.now()}${extname(file.originalname)}`;
      callback(null, filename);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  },
};

@Controller('variete')
export class VarieteController {
  constructor(private readonly varieteService: VarieteService) { }

  @ApiOperation({ summary: "creation d'une variété" })
  @UseGuards(UserAuthGuard)
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  @Post()
  create(@Body() createVarieteDto: CreateVarieteDto, @UploadedFile() image: Express.Multer.File) {
    return this.varieteService.create(createVarieteDto, toWebPath(image?.path));
  }

  @ApiOperation({ summary: "Affichage de toutes les variétés" })
  @Get()
  findAll() {
    return this.varieteService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: "Affichage d'une variété à partir de son id" })
  findOne(@Param('id') id: string) {
    return this.varieteService.findOne(id);
  }

  @UseGuards(UserAuthGuard)
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  @Patch(':id')
  @ApiOperation({ summary: "Mise à jour d'une variété" })
  update(@Param('id') id: string, @Body() updateVarieteDto: UpdateVarieteDto, @UploadedFile() image: Express.Multer.File) {
    return this.varieteService.update(id, updateVarieteDto, toWebPath(image?.path));
  }

  @UseGuards(UserAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: "suppression d'une variété à partir de son id" })
  remove(@Param('id') id: string) {
    return this.varieteService.remove(id);
  }
}
