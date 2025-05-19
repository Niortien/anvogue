import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEmpty, IsOptional, IsString } from 'class-validator';
// import { isValid, parse } from "date-fns"; je dois installer date-fns
export class CreateClientDto {
  @ApiProperty({
    type: String,
    description: 'Camara',
  })
  @IsString()
  @IsEmpty()
  nom: string;

  @ApiProperty({
    type: String,
    description: 'Nangala',
  })
  @IsString()
  @IsEmpty()
  prenom: string;

  @ApiProperty({
    type: String,
    description: 'Camla',
  })
  @IsString()
  @IsEmpty()
  nomUtilisateurClient: string;

  @ApiProperty({
    type: String,
    description: 'Camara',
  })
  @IsString()
  @IsEmpty()
  @IsEmail()
  @Transform(({ value }) => value.trim())
  email: string;

  @ApiProperty({
    type: String,
    description: '080909086',
  })
  @IsString()
  @IsEmpty()
  phone: string;
  @ApiProperty({
    type: String,
    description: 'client',
  })
  @IsString()
  @IsEmpty()
  @IsEmail()
  @Transform(({ value }) => value.trim())
  password: string;

  @ApiProperty({ type: Date, description: '12-06-2002' })
  @IsOptional()
  // @Transform(({ value }) => {
  //     const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
  //     if (isValid(parsedDate)) {
  //         return parsedDate.toISOString();
  //     }
  //     return value;
  // }) j dois decommenter cette partie après avoir installer date-fns
  date_naissance: string;
  // je dois travailler encore sur la date avec une librairie
  @ApiProperty({
    type: String,
    description: 'Feminin',
  })
  @IsString()
  @IsEmpty()
  genre: string;

  @ApiProperty({
    type: String,
    description: 'image.jpg',
  })
  @IsString()
  @IsEmpty()
  @Transform(({ value }) => value.trim())
  avatar: string;

  @ApiProperty({
    type: String,
    description: 'cocody ',
  })
  @IsString()
  @IsEmpty()
  adresse: string;
}
