
// import { UtilisateurService } from './../../utilisateur/utilisateur.service';
// import { jwtConstants } from 'src/authentification/constant/JWTConstants';
// import { Injectable } from "@nestjs/common";
// import { PassportStrategy } from "@nestjs/passport";
// import { ExtractJwt, Strategy } from "passport-jwt";



// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy,"jwt") {

//     constructor(private readonly utilisateurService: UtilisateurService) {
//         super({
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             ignoreExpiration: false,
//             secretOrKey: jwtConstants.secret,
//         })
//     }
//     async validate(payload: {
//         id: string;
//         email: string;
//     }) {

//         const utilisateur = await this.utilisateurService.findOne(payload.id);

//         const { password, ...rest } = utilisateur;

//         return rest;
//     }
// }

// // Nom de la stratégie par défaut c'est jwt