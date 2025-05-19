import { ApiOperation, ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsEmpty, IsOptional, IsString } from "class-validator"

export class CreateArticleDto {
     @ApiProperty({
        type:String,description:"jueidke"
    })
   @IsString()
   @IsEmpty() 
    id:string
    @ApiProperty({
        type:String,description:"jueidke"
    })
   @IsString()
   @IsEmpty() 
reference :string 

 @ApiProperty({
        type:String,description:"coco"
    })
   @IsString()
   @IsEmpty() 
  nom :string
   @ApiProperty({
        type:String,description:"high quality"
    })
   @IsString()
   @IsEmpty() 
  description :string
   @ApiProperty({
        type:String,description:"ezn8dz"
    })
   @IsString()
   @IsEmpty() 
  categorie_id :string
   @ApiProperty({
        type:String,description:"coton"
    })
   @IsString()
   @IsEmpty() 
  matière :string 
   @ApiProperty({
        type:String,description:"coco chanel"
    })
   @IsString()
   @IsEmpty() 
  marque :string
   @ApiProperty({
        type:String,description:"disponible"
    })
   @IsString()
   @IsEmpty() 
  etat :string 

  @ApiProperty({ type: String, description: 'Avatar' })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value.trim())
    image?: string;
}

