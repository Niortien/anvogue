import { ConnexionDto } from './dto/connexion.dto';
import { UtilisateurService } from './../utilisateur/utilisateur.service';
import { ClientService } from './../client/client.service';

import { BadRequestException, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { InscriptionDto } from './dto/inscription.dto';
import { InscriptionClientDto } from './dto/inscriptionClient.dto';
import { ConnexionDtoClient } from './dto/connexionClient.dto';
import { HachageService } from './hachage/hachage.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly ClientService: ClientService,
    private readonly jwtService: JwtService,
    private readonly UtilisateurService: UtilisateurService,
    private readonly HachageService: HachageService,
    private readonly configService: ConfigService
  ) { }

  //INSCRIPTION ET CONNEXION DE L'UTILISATEUR
  async inscription(inscriptionDto: InscriptionDto) {
    // A l'inscription on récupère les données du nouvel utilisateur sous forme inscriptionDto

    let utilisateurExiste = await this.UtilisateurService.findOneByEmail(
      inscriptionDto.email,
    ); // ensuite on verifie s'il existe a travers son email dans notre bd

    if (!utilisateurExiste) {
      utilisateurExiste = await this.UtilisateurService.findOneByNomUtilisateur(
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
    const nouvelUtilisateur = await this.UtilisateurService.create({
      ...inscriptionDto,
      password: hachePassword
    });

    return nouvelUtilisateur
  }

  async connexion(ConnexionDto: ConnexionDto) {

    let utilisateurExiste = await this.UtilisateurService.findOneByEmail(
      ConnexionDto.email,
    ); // ensuite on verifie s'il existe a travers son email dans notre bd

    if (!utilisateurExiste) {
      utilisateurExiste = await this.UtilisateurService.findOneByNomUtilisateur(
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

  //INSCRIPTION ET CONNEXION DU CLIENT

  async inscriptionClient(InscriptionClientDto: InscriptionClientDto) {
    // A l'inscription on récupère les données du nouvel utilisateur sous forme  inscriptionDto
    const utilisateurExiste = await this.UtilisateurService.findOneByEmail(
      InscriptionClientDto.email,
    ); // ensuite on verifie s'il existe a travers son email dans notre bd
    if (utilisateurExiste) {
      throw new BadRequestException('Utilisateur existe déjà.'); // s'il existe , on renvoie ce message
    }

    //s'il n'existe pas , on hache son mot de passe à partir de la fonction que nous avon crée dans le hacheService
    const hachePassword = await this.HachageService.hachPassword(
      InscriptionClientDto.password,
    );
    // après avoir hache, on enregistre le nouvel utilisateur maintenant  tout en hachant son mot de passe
    const nouvelUtilisateur = await this.UtilisateurService.create({
      ...InscriptionClientDto,
      password: hachePassword
    });
    // Vérification de la structure de nouvelUtilisateur

    return nouvelUtilisateur

  }

  async connexionClient(ConnexionDto: ConnexionDtoClient) {

    const utilisateurExiste = await this.UtilisateurService.findOneByEmail(
      ConnexionDto.email,
    ); // ensuite on verifie s'il existe a travers son email dans notre bd
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

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get("CLIENT_TOKEN_SECRET"),
      expiresIn: this.configService.get("CLIENT_TOKEN_EXPIRATION")
    });

    const { password, updatedAt, ...rest } = utilisateurExiste;
    return { token, user: rest };

  }
















  async profile(req: Request) {
    const { user } = req as any;

    return user;
  }
}



