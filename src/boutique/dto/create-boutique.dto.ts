import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsObject, IsString } from "class-validator";

export class CreateBoutiqueDto {
  @ApiProperty({
    type: String,
    description: "Unique reference code for the boutique",
    example: "BT-2025-001"
  })
  @IsString()
  @IsNotEmpty() 
  reference: string;

  @ApiProperty({
    type: String,
    description: "Name of the boutique",
    example: "Playce Fashion"
  })
  @IsString()
  @IsNotEmpty()  
  nom: string;

  @ApiProperty({
    type: String,
    description: "Physical address of the boutique",
    example: "123 Cocody Boulevard"
  })
  @IsString()
  @IsNotEmpty() 
  adresse: string;

  @ApiProperty({
    type: String,
    description: "Contact email for the boutique",
    example: "contact@playcefashion.com"
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty() 
  @Transform(({ value }) => value?.trim()) 
  email: string;

  @ApiProperty({
    type: String,
    description: "Contact phone number for the boutique",
    example: "22578123456"
  })
  @IsString()
  @IsNotEmpty() 
  telephone: string;

  @ApiProperty({
    type: Object,
    description: "Social media handles",
    example: {
      instagram: "@playce_fashion",
      facebook: "Playce Fashion Boutique"
    }
  })
  @IsObject() 
  @IsNotEmpty() 
  reseaux: Record<string, string>; // Record<string, string> est un type générique en TypeScript qui définit un objet dont :

// Les clés (propriétés) sont de type string
// Les valeurs associées à ces clés sont aussi de type string

  @ApiProperty({
    type: Object,
    description: "Opening hours of the boutique",
    example: {
      lundi: "9:00-18:00",
      mardi: "9:00-18:00",
      mercredi: "9:00-18:00",
      jeudi: "9:00-18:00",
      vendredi: "9:00-18:00",
      samedi: "10:00-16:00",
      dimanche: "Closed"
    }
  })
  @IsObject() // ça doit être un objet
  @IsNotEmpty() 
  horaire: Record<string, string>; // Changed from JSON to Record<string, string>
}