import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ArticleService } from '../services/article.service';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { ApiOperation } from '@nestjs/swagger';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) { }
  @ApiOperation({ summary: "creation d'un article" })
  @UseInterceptors(FileInterceptor('image', {
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
    }
  }))
  @Post()
  create(@Body() createArticleDto: CreateArticleDto, @UploadedFile() image: Express.Multer.File) {
    return this.articleService.create({ ...createArticleDto, image: image?.path });
  }


  @ApiOperation({ summary: "Affichage de tous les articles" })
  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: "Affichage d'un  article à partir de son id" })
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }


  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
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
    }
  }))
  @Patch(':id')
  @ApiOperation({ summary: "Mise à jour d'un article" })
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto, @UploadedFile() image: Express.Multer.File) {
    return this.articleService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "suppression d'un article à partir de son id" })
  remove(@Param('id') id: string) {
    return this.articleService.remove(id);
  }
}
