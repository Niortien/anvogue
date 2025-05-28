
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCollectionDto {

    @IsNotEmpty()
    @IsString()
    nom: string;

    @IsOptional()
    @IsString()
    description?: string;

}
