
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UtilisateurService } from "src/modules/utilisateur/utilisateur.service";

@Injectable()
export class RefreshAuthStrategy extends PassportStrategy(Strategy, "refreshAuth") {

    constructor(readonly configService: ConfigService, private readonly utilisateurService: UtilisateurService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get("REFRESH_TOKEN_SECRET")!,
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