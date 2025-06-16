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

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';

@ApiTags('Variétés')
@Controller('variete')
export class VarieteController {
  constructor(private readonly varieteService: VarieteService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle variété' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Variété créée avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
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
          return callback(new Error('Seuls les fichiers images sont autorisés!'), false);
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
  @ApiOperation({ summary: 'Récupérer toutes les variétés' })
  @ApiResponse({ status: 200, description: 'Liste des variétés.' })
  findAll() {
    return this.varieteService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une variété par ID' })
  @ApiResponse({ status: 200, description: 'Variété trouvée.' })
  @ApiResponse({ status: 404, description: 'Variété non trouvée.' })
  findOne(@Param('id') id: string) {
    return this.varieteService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une variété' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Variété mise à jour avec succès.' })
  @ApiResponse({ status: 404, description: 'Variété non trouvée.' })
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
          return callback(new Error('Seuls les fichiers images sont autorisés!'), false);
        }
        callback(null, true);
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateVarieteDto: UpdateVarieteDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const imagePaths = images?.map((img) => img.path) || [];
    return this.varieteService.update(id, {
      ...updateVarieteDto,
      ...(images.length > 0 && { images: imagePaths }),
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une variété' })
  @ApiResponse({ status: 200, description: 'Variété supprimée avec succès.' })
  @ApiResponse({ status: 404, description: 'Variété non trouvée.' })
  remove(@Param('id') id: string) {
    return this.varieteService.remove(id);
  }
}
