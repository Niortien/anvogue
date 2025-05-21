import { IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";


export class ConnexionDto {
    @ApiProperty({ type: String, description: "Email" })
    @IsString({ message: "Email ou le nom d'utilisateur doit etre une chaine de caractere" })
    @IsNotEmpty({ message: "Email ou le nom d'utilisateur est requis" })
    @Transform(({ value }) => value.trim())
    email: string;

    @ApiProperty({ type: String, description: "Password" })
    @IsString({ message: "Password doit etre une chaine de caractere" })
    @MaxLength(15)
    @IsNotEmpty({ message: "Password est requis" })
    @Transform(({ value }) => value?.trim())
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message:
            'Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.',
    })
    password: string;
}
