
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { ClientService } from "src/modules/client/client.service";

@Injectable()
export class ClientAuthStrategy extends PassportStrategy(Strategy, "clientAuth") {

    constructor(readonly configService: ConfigService, private readonly clientService: ClientService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get("CLIENT_TOKEN_SECRET")!,
        })
    }
    async validate(payload: {
        id: string;
        email: string;
    }) {

        const client = await this.clientService.findOne(payload.id);

        return client;
    }
}

// Nom de la stratégie par défaut c'est jwt