import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { plainToInstance } from 'class-transformer';

import { VarieteService } from '../services/variete.service';
import { CreateVarieteDto } from '../dto/create-variete.dto';
import { UpdateVarieteDto } from '../dto/update-variete.dto';

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
  FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/articles',
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
  @Body() body: any,
  @UploadedFile() image: Express.Multer.File,
) {
  try {
    if (typeof body.tailles === 'string') {
      body.tailles = JSON.parse(body.tailles);
    }
  } catch (e) {
    throw new BadRequestException(`Le champ 'tailles' doit être un JSON valide`);
  }

  const dto = plainToInstance(CreateVarieteDto, {
    ...body,
    image: image?.path,
  });

  return this.varieteService.create(dto);
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
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/varietes',
        filename: (req, file, callback) => {
          const filename = `image-${Date.now()}${extname(file.originalname)}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new Error('Seuls les fichiers images sont autorisés!'), false);
        }
        callback(null, true);
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() image: Express.Multer.File,
  ) {
    try {
      if (typeof body.tailles === 'string') {
        body.tailles = JSON.parse(body.tailles);
      }
      if (!Array.isArray(body.tailles)) {
        throw new BadRequestException(`Le champ 'tailles' doit être un tableau`);
      }
    } catch (e) {
      throw new BadRequestException(`Le champ 'tailles' doit être un JSON valide`);
    }

    const updateDto = plainToInstance(UpdateVarieteDto, {
      ...body,
      image: image?.path,
    });

    return this.varieteService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une variété' })
  @ApiResponse({ status: 200, description: 'Variété supprimée avec succès.' })
  @ApiResponse({ status: 404, description: 'Variété non trouvée.' })
  remove(@Param('id') id: string) {
    return this.varieteService.remove(id);
  }
}
