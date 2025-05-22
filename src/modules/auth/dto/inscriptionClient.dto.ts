import { ApiProperty } from '@nestjs/swagger';
import { Genre } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { isValid, parse } from "date-fns";

export class InscriptionClientDto {
  @ApiProperty({
    type: String,
    description: "Nom du client"
  })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({
    type: String,
    description: "Prénom du client"
  })
  @IsString()
  @IsNotEmpty()
  prenom: string;

  @ApiProperty({
    type: String,
    description: "Nom d'utilisateur du client"
  })
  @IsString()
  @IsNotEmpty()
  nomUtilisateur: string;

  @ApiProperty({
    type: String,
    description: "Email du client"
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: "Numéro de téléphone du client"
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    type: String,
    description: "Mot de passe du client"
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    description: "Genre du client",
    enum: Genre
  })
  @IsEnum(Genre)
  @IsNotEmpty()
  genre: Genre;

  @ApiProperty({
    type: String,
    description: "Adresse du client"
  })
  @IsString()
  @IsNotEmpty()
  adresse: string;

  @ApiProperty({
    type: String,
    format: 'date',
    description: "Date de naissance du client"
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
    description: "Avatar du client"
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  avatar?: string;
}