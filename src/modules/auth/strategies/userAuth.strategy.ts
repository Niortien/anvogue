
import { UtilisateurService } from '../../utilisateur/utilisateur.service';
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "userAuth") {

    constructor(readonly configService: ConfigService, private readonly utilisateurService: UtilisateurService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get("TOKEN_SECRET")!,
        })
    }
    async validate(payload: {
        id: string;
        email: string;
    }) {

        const utilisateur = await this.utilisateurService.findOne(payload.id);

        return utilisateur;
    }
}

// Nom de la stratégie par défaut c'est jwt