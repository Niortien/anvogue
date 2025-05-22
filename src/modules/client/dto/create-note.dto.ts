import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDecimal, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";

export class CreateNoteDto {
    @ApiProperty({
        type: Number,
        description: "Note en étoiles (entre 0 et 5)",
        minimum: 0,
        maximum: 5
    })
    @IsDecimal()
    @Min(0)
    @Max(5)
    @IsNotEmpty()
    @Type(() => Number)
    etoile: number;

    @ApiProperty({
        type: String,
        description: "Commentaire de l'évaluation"
    })
    @IsString()
    @IsNotEmpty()
    commentaire: string;

    @ApiProperty({
        type: String,
        description: "ID de la note à laquelle on répond (optionnel)"
    })
    @IsString()
    @IsUUID()
    @IsOptional()
    reponse?: string;

    @ApiProperty({
        type: String,
        description: "ID du client qui évalue"
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    client_id: string;

    @ApiProperty({
        type: String,
        description: "ID de l'article évalué"
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    article_id: string;
}