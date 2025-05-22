import { ApiProperty } from "@nestjs/swagger";
import { Genre, Role } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

import { isValid, parse } from "date-fns";

export class CreateUtilisateurDto {
  @ApiProperty({
    type: String,
    description: "Nom complet de l'utilisateur"
  })
  @IsString()
  @IsNotEmpty()
  nomComplet: string;

  @ApiProperty({
    type: String,
    description: "Nom d'utilisateur"
  })
  @IsString()
  @IsNotEmpty()
  nomUtilisateur: string;

  @ApiProperty({
    type: String,
    description: "Email de l'utilisateur"
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: "Mot de passe de l'utilisateur"
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    description: "Rôle de l'utilisateur",
    enum: Role,
    default: Role.ADMIN
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({
    type: String,
    format: 'date',
    description: "Date de naissance de l'utilisateur"
  })
  @IsDateString()
  @IsOptional()
  @Transform(({ value }) => {
    const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
    if (isValid(parsedDate)) {
      return parsedDate.toISOString();
    }
    return value;
  })
  date_naissance?: string;

  @ApiProperty({
    type: String,
    description: "Genre de l'utilisateur",
    enum: Genre
  })
  @IsEnum(Genre)
  @IsOptional()
  genre?: Genre;

  @ApiProperty({
    type: String,
    description: "Avatar de l'utilisateur"
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  avatar?: string;
}