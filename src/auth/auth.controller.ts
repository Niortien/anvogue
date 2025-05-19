import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, InscriptionDto } from './dto/inscription.dto';
import { UpdateAuthDto } from './dto/connexion.dto';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Inscription utilisateur" })
  @ApiBadRequestResponse({ description: "Utilisateur existe déjà." })
  @ApiCreatedResponse({ description: "Utilisateur créé avec succès." })
  @Post("/inscription")
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/users',
      filename: (req, file, callback) => {
        const filename = `avatar-${Date.now()}${extname(file.originalname)}`;
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
  inscription(@Body() inscriptionDto: InscriptionDto, @UploadedFile() image: Express.Multer.File) {
    return this.authService.inscription({ ...inscriptionDto, avatar: image.path || "" });
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
