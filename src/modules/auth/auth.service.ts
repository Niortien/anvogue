
import { ConnexionDto } from './dto/connexion.dto';
import { UtilisateurService } from './../utilisateur/utilisateur.service';


import { BadRequestException, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { InscriptionDto } from './dto/inscription.dto';
import { InscriptionClientDto } from './dto/inscriptionClient.dto';
import { HachageService } from './hachage/hachage.service';
import { ConfigService } from '@nestjs/config';
import { ConnexionClientDto } from './dto/connexionClient.dto';
import { OtpService } from './otp/otp.service';
import { NotificationService } from 'src/notification/notification.service';
import { Request } from 'express';
import { ClientService } from '../client/services/client.service';
import { Utilisateur } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(
    private readonly clientService: ClientService,
    private readonly jwtService: JwtService,
    private readonly utilisateurService: UtilisateurService,
    private readonly HachageService: HachageService,
    private readonly configService: ConfigService,
    private readonly otpService: OtpService,
    private readonly notificationService: NotificationService
  ) { }

  //INSCRIPTION ET CONNEXION DE L'UTILISATEUR
  async inscription(inscriptionDto: InscriptionDto) {
    // A l'inscription on récupère les données du nouvel utilisateur sous forme inscriptionDto

    let utilisateurExiste = await this.utilisateurService.findOneByEmail(
      inscriptionDto.email,
    ); // ensuite on verifie s'il existe a travers son email dans notre bd

    if (!utilisateurExiste) {
      utilisateurExiste = await this.utilisateurService.findOneByNomUtilisateur(
        inscriptionDto.nomUtilisateur,
      ); // ensuite on verifie s'il existe a travers son nomUtilisateur dans notre bd
    }

    if (utilisateurExiste) {
      throw new BadRequestException('Utilisateur existe déjà.'); // s'il existe , on renvoie ce message
    }

    //s'il n'existe pas , on hache son mot de passe à partir de la fonction que nous avon crée dans le hacheService
    const hachePassword = await this.HachageService.hachPassword(
      inscriptionDto.password,
    );

    // après avoir hache, on enregistre le nouvel utilisateur maintenant  tout en hachant son mot de passe
    const nouvelUtilisateur = await this.utilisateurService.create({
      ...inscriptionDto,
      password: hachePassword,
      date_naissance: inscriptionDto.date_naissance ? new Date(inscriptionDto.date_naissance).toISOString() : undefined,
    });

    return nouvelUtilisateur
  }

  async connexion(ConnexionDto: ConnexionDto) {

    let utilisateurExiste = await this.utilisateurService.findOneByEmail(
      ConnexionDto.email,
    ); // ensuite on verifie s'il existe a travers son email dans notre bd

    if (!utilisateurExiste) {
      utilisateurExiste = await this.utilisateurService.findOneByNomUtilisateur(
        ConnexionDto.email,
      ); // ensuite on verifie s'il existe a travers son nomUtilisateur dans notre bd
    }

    if (!utilisateurExiste) {
      throw new BadRequestException("Utilisateur n'existe pas."); // s'il n'existe  pas , on renvoie ce message
    }
    //on compare le mot de passe fourni par l'utilisateur avec le mot de passe haché stocké dans la base de données
    //on utilise le service de hachage pour comparer les mots de passe
    const passwordHache = await this.HachageService.comparePassword(ConnexionDto.password, utilisateurExiste.password);
    if (!passwordHache) {
      throw new BadRequestException('Mot de passe incorrect.');
    }
    // Generate Token
    //on génère un token JWT pour l'utilisateur
    //on utilise le service JWT pour signer le token avec les informations de l'utilisateur

    const payload = {
      id: utilisateurExiste.id,
      email: utilisateurExiste.email
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get("TOKEN_SECRET"),
      expiresIn: this.configService.get("TOKEN_EXPIRATION")
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get("REFRESH_TOKEN_SECRET"),
      expiresIn: this.configService.get("REFRESH_TOKEN_EXPIRATION")
    });

    const { password, updatedAt, ...rest } = utilisateurExiste;


    return { accessToken, refreshToken, user: rest };
  }
  async refreshAccessToken(req: Request) {
    const utilisateur = req.user as Utilisateur;

    const payload = {
      id: utilisateur.id,
      email: utilisateur.email
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get("TOKEN_SECRET"),
      expiresIn: this.configService.get("TOKEN_EXPIRATION")
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get("REFRESH_TOKEN_SECRET"),
      expiresIn: this.configService.get("REFRESH_TOKEN_EXPIRATION")
    });

    return { accessToken, refreshToken }
  }
  //INSCRIPTION ET CONNEXION DU CLIENT

  async inscriptionClient(InscriptionClientDto: InscriptionClientDto) {

    // A l'inscription on récupère les données du nouvel utilisateur sous forme  inscriptionDto
    const clientExiste = await this.clientService.findOneByEmail(
      InscriptionClientDto.email,
    ); // ensuite on verifie s'il existe a travers son email dans notre bd

    if (clientExiste) {
      throw new BadRequestException('Utilisateur existe déjà.'); // s'il existe , on renvoie ce message
    }

    //s'il n'existe pas , on hache son mot de passe à partir de la fonction que nous avon crée dans le hacheService
    const hachePassword = await this.HachageService.hachPassword(
      InscriptionClientDto.password,
    );

    // après avoir hache, on enregistre le nouvel utilisateur maintenant  tout en hachant son mot de passe
    const client = await this.clientService.create({
      ...InscriptionClientDto,
      password: hachePassword
    });

    // Envoie de mail de bienvenue
    await this.notificationService.sendEmail(InscriptionClientDto.email, "Bienvenue sur Anvogue", `
      <h1>Bienvenue sur Anvogue</h1>
      <p>${client.genre === "MASCULIN" ? "Cher" : "Chère"} ${client.prenom} ${client.nom}, Vous avez bien été inscrit sur Anvogue</p>
      <p>Vous pouvez maintenant vous connecter</p>
      <p>Merci de votre inscription</p>
      <p>Cordialement</p>
      <p>Equipe Anvogue</p>
      `);

    // Vérification de la structure de nouvelUtilisateur
    return client

  }

  async connexionClient(ConnexionDto: ConnexionClientDto) {

    const clientExiste = await this.clientService.findOneByEmail(
      ConnexionDto.email,
    ); // ensuite on verifie s'il existe a travers son email dans notre bd

    if (!clientExiste) {
      throw new BadRequestException("Utilisateur n'existe pas."); // s'il n'existe  pas , on renvoie ce message
    }

    //on compare le mot de passe fourni par l'utilisateur avec le mot de passe haché stocké dans la base de données
    //on utilise le service de hachage pour comparer les mots de passe

    const passwordHache = await this.HachageService.comparePassword(ConnexionDto.password, clientExiste.password);
    if (!passwordHache) {
      throw new BadRequestException('Mot de passe incorrect.');
    }
    // Envoie de l'otp
    const otp = await this.otpService.generate(clientExiste.email);

    // on envoie l'otp au client
    const data = await this.notificationService.sendEmail(clientExiste.email, "Confirmation d'inscription", `Utilisez ce code pour terminer votre connexion : ${otp}`);

    if (data.error) {
      throw new BadRequestException(data.error.message);
    }

    return otp

  }


  async verifyOtp(OtpDto: { email: string, otp: string }) {

    const clientExiste = await this.clientService.findOneByEmail(
      OtpDto.email,
    ); // ensuite on verifie s'il existe a travers son email dans notre bd

    if (!clientExiste) {
      throw new BadRequestException("Utilisateur n'existe pas."); // s'il n'existe  pas , on renvoie ce message
    }

    // Verification de l'otp
    const otp = await this.otpService.verify(OtpDto.otp);
    if (!otp) {
      throw new BadRequestException("OTP incorrect.");
    }

    // Generate Token
    const payload = {
      id: clientExiste.id,
      email: clientExiste.email
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get("CLIENT_TOKEN_SECRET"),
      expiresIn: this.configService.get("CLIENT_TOKEN_EXPIRATION")
    });

    const { password, updatedAt, ...rest } = clientExiste;
    return { token, user: rest };
  }


  async profile(req: Request) {
    const { user } = req as any;

    return user;
  }
}



