import { ApiProperty } from '@nestjs/swagger';
import { Genre, Role } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { isValid, parse } from "date-fns";

export class InscriptionDto {
  @ApiProperty({
    type: String,
    description: 'Soro Guefala',
  })
  @IsNotEmpty()
  @IsString()
  nomComplet: string;

  @ApiProperty({
    type: String,
    description: 'SoFal',
  })
  @IsNotEmpty()
  @IsString()
  nomUtilisateur: string;

  @ApiProperty({
    type: String,
    description: 'Soroguefala@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @Transform(({ value }) => value.trim()) // ce pipe elimine les espaces
  email: string;

  @ApiProperty({ type: String, description: "Password" })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  password: string;

  @ApiProperty({ type: String, description: 'Admin' })
  @IsString()
  @IsNotEmpty()
  role: Role;

  @ApiProperty({ type: Date, description: 'Birth Date' })
  @IsOptional()
  @Transform(({ value }) => {
    const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
    if (isValid(parsedDate)) {
      return parsedDate.toISOString();
    }
    return value;
  })
  date_naissance?: string; // je dois travailler encore sur la date avec une librairie

  @ApiProperty({ type: String, description: 'Feminin' })
  @IsString()
  @IsNotEmpty()
  genre: Genre;

  @ApiProperty({ type: String, description: 'Avatar' })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  avatar?: string;
}