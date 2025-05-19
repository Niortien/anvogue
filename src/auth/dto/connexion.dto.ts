import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";


export class ConnexionDto {
    @ApiProperty({ type: String, description: "Email" })
    @IsEmail()
    @IsNotEmpty({ message: "Email est requis" })
    @Transform(({ value }) => value.trim())
    email: string;

    @ApiProperty({ type: String, description: "Password" })
    @IsString({ message: "Password doit etre une chaine de caractere" })
    @IsNotEmpty({ message: "Password est requis" })
    @Transform(({ value }) => value.trim())
    password: string;
}
