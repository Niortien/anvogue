import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { VarieteService } from '../services/variete.service';
import { CreateVarieteDto } from '../dto/create-variete.dto';
import { UpdateVarieteDto } from '../dto/update-variete.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('variete')
export class VarieteController {
  constructor(private readonly varieteService: VarieteService) { }

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 5, {
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
    }),
  )
  create(
    @Body() createVarieteDto: CreateVarieteDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const imagePaths = images?.map((img) => img.path) || [];
    return this.varieteService.create({
      ...createVarieteDto,
      images: imagePaths,
    });
  }

  @Get()
  findAll() {
    return this.varieteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.varieteService.findOne(id);
  }
  @UseInterceptors(
    FilesInterceptor('images', 5, {
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
    }),
  )
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVarieteDto: UpdateVarieteDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const imagePaths = images?.map((img) => img.path) || [];
    return this.varieteService.update(id, {
      ...updateVarieteDto,
      ...(images && { images: imagePaths }),
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.varieteService.remove(id);
  }
}
