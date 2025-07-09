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
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ArticleService } from '../services/article.service';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { ApiOperation } from '@nestjs/swagger';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { QueryArticleDto } from '../dto/query-article.dto';
import { plainToInstance } from 'class-transformer';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: "Création d'un article" })
  @Post()
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
  create(@Body() body: any, @UploadedFile() image: Express.Multer.File) {
    try {
      if (typeof body.infos === 'string') {
        body.infos = JSON.parse(body.infos);
      }
    } catch (e) {
      throw new BadRequestException(`Le champ 'infos' doit être un JSON valide`);
    }

    const createDto = plainToInstance(CreateArticleDto, {
      ...body,
      image: image?.path,
    });

    return this.articleService.create(createDto);
  }

  @ApiOperation({ summary: 'Affichage de tous les articles' })
  @Get()
  findAll(@Query() query: QueryArticleDto) {
    return this.articleService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: "Affichage d'un article à partir de son id" })
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Mise à jour d'un article" })
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
  update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() image: Express.Multer.File,
  ) {
    try {
      if (typeof body.infos === 'string') {
        body.infos = JSON.parse(body.infos);
      }
    } catch (e) {
      throw new BadRequestException(`Le champ 'infos' doit être un JSON valide`);
    }

    const updateDto = plainToInstance(UpdateArticleDto, {
      ...body,
      image: image?.path,
    });

    return this.articleService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Suppression d'un article à partir de son id" })
  remove(@Param('id') id: string) {
    return this.articleService.remove(id);
  }
}
