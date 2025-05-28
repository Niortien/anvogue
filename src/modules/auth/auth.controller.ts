import { Controller, Get, Post, Body, UploadedFile, UseInterceptors, Req, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { InscriptionDto } from 'src/modules/auth/dto/inscription.dto';

import { extname } from 'path';
import { diskStorage } from 'multer';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConnexionDto } from 'src/modules/auth/dto/connexion.dto';
import { InscriptionClientDto } from 'src/modules/auth/dto/inscriptionClient.dto';
import { ConnexionClientDto } from 'src/modules/auth/dto/connexionClient.dto';
import { Request } from 'express';
import { RefreshAuthGuard } from './guards/refreshAuth.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: "Inscription utilisateur" })
  @ApiBadRequestResponse({ description: "Utilisateur existe déjà." })
  @ApiCreatedResponse({ description: "Utilisateur créé avec succès." })
  @Post("/inscription")
  @UseInterceptors(FileInterceptor('avatar', {
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
    return this.authService.inscription({ ...inscriptionDto, avatar: image?.path });
  }

  @Post("/connexion")
  connexion(@Body() connexionDto: ConnexionDto) {
    return this.authService.connexion(connexionDto);
  }

  @UseGuards(RefreshAuthGuard)
  @Get("/refresh-token")
  refreshAccessToken(@Req() req: Request) {
    return this.authService.refreshAccessToken(req);
  }

  @ApiOperation({ summary: "Inscription client" })
  @ApiBadRequestResponse({ description: "Client existe déjà." })
  @ApiCreatedResponse({ description: "Client créé avec succès." })
  @Post("/signin")
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './uploads/client',
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
  inscriptionClient(@Body() inscriptionClientDto: InscriptionClientDto, @UploadedFile() avatar: Express.Multer.File) {
    return this.authService.inscriptionClient({ ...inscriptionClientDto, avatar: avatar?.path });
  }

  @Post("/login")
  connexionClient(@Body() connexionClientDto: ConnexionClientDto) {
    return this.authService.connexionClient(connexionClientDto);
  }

  @Post("/verify")
  verifyOtp(@Body() OtpDto: { email: string, otp: string }) {
    return this.authService.verifyOtp(OtpDto);
  }
}
