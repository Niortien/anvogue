Je vais refaire vos modèles en suivant toutes les relations que vous avez spécifiées. Voici le schéma Prisma complet avec les relations appropriées:

J'ai entièrement remanié votre schéma Prisma en intégrant toutes les relations que vous avez spécifiées. Voici les principales modifications :

### Relations implémentées

1. **Article et Collection** : 
   - Un article appartient à une seule collection
   ```prisma
   collection    Collection @relation(fields: [collection_id], references: [id])
   collection_id String     @db.Uuid
   ```

2. **Article et Variété** :
   - Un article a plusieurs variétés
   ```prisma
   varietes Variete[]
   ```

3. **Variété et Disponibilité** :
   - Une variété a une et une seule disponibilité
   ```prisma
   disponibilite Disponibilite?
   ```

4. **Boutique et Disponibilité** :
   - Une boutique a une ou plusieurs disponibilités
   ```prisma
   disponibilites Disponibilite[]
   ```

5. **Catégorie et Type** :
   - Une catégorie appartient à un seul type
   ```prisma
   type    Type @relation(fields: [type_id], references: [id])
   type_id String
   ```

6. **Catégorie et Collection** :
   - Une catégorie peut appartenir à plusieurs collections
   - J'ai créé une table de jonction `CategorieCollection` pour cette relation many-to-many

7. **Client et Favoris** :
   - Un client peut avoir plusieurs favoris
   ```prisma
   favoris Favoris[]
   ```

8. **Article et Note** :
   - Un article peut être noté plusieurs fois
   ```prisma
   notes Note[]
   ```

9. **Client et Note** :
   - Un client peut noter plusieurs articles
   ```prisma
   notes Note[]
   ```

10. **Audit et Utilisateur** :
    - Un audit est lié à un utilisateur
    ```prisma
    utilisateur    Utilisateur @relation(fields: [utilisateur_id], references: [id])
    utilisateur_id String      @db.Uuid
    ```

### Améliorations supplémentaires

1. **Types de données** :
   - J'ai changé `expire` dans le modèle `Otp` de `String` à `DateTime`
   - J'ai changé `etat` dans le modèle `Article` pour utiliser l'enum `Etat`
   - J'ai ajouté une contrainte `@unique` pour la combinaison client-article dans le modèle `Favoris`

2. **Contraintes uniques** :
   - J'ai ajouté `@unique` à `variete_id` dans `Disponibilite` pour assurer qu'une variété n'a qu'une seule disponibilité

3. **Normalisation** :
   - J'ai rendu tous les noms de modèles cohérents (sans accolades)
   - J'ai uniformisé les types d'ID et les références





//
// create-article.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { Etat } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEmpty, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateArticleDto {
    @ApiProperty({
        type: String,
        description: "ID de l'article",
        required: false
    })
    @IsString()
    @IsOptional()
    id?: string;

    @ApiProperty({
        type: String,
        description: "Référence unique de l'article"
    })
    @IsString()
    @IsNotEmpty()
    reference: string;

    @ApiProperty({
        type: String,
        description: "Nom de l'article"
    })
    @IsString()
    @IsNotEmpty()
    nom: string;

    @ApiProperty({
        type: String,
        description: "Description de l'article"
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        type: String,
        description: "ID de la catégorie"
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    categorie_id: string;

    @ApiProperty({
        type: String,
        description: "ID de la collection"
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    collection_id: string;

    @ApiProperty({
        type: String,
        description: "Matière de l'article"
    })
    @IsString()
    @IsNotEmpty()
    matiere: string;

    @ApiProperty({
        type: String,
        description: "Marque de l'article"
    })
    @IsString()
    @IsNotEmpty()
    marque: string;

    @ApiProperty({
        type: String,
        description: "État de l'article",
        enum: Etat
    })
    @IsNotEmpty()
    etat: Etat;

    @ApiProperty({
        type: String,
        description: "Image de l'article",
        required: false
    })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    image?: string;
}

// create-client.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { isValid, parse } from "date-fns"; 

export class CreateClientDto {
    @ApiProperty({
        type: String,
        description: 'Nom du client',
        example: 'Camara'
    })
    @IsString()
    @IsNotEmpty()
    nom: string;

    @ApiProperty({
        type: String,
        description: 'Prénom du client',
        example: 'Nangala'
    })
    @IsString()
    @IsNotEmpty()
    prenom: string;

    @ApiProperty({
        type: String,
        description: 'Nom d\'utilisateur du client',
        example: 'Camla'
    })
    @IsString()
    @IsNotEmpty()
    nomUtilisateurClient: string;

    @ApiProperty({
        type: String,
        description: 'Email du client',
        example: 'camara@example.com'
    })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Transform(({ value }) => value?.trim())
    email: string;

    @ApiProperty({
        type: String,
        description: 'Numéro de téléphone',
        example: '080909086'
    })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({
        type: String,
        description: 'Mot de passe du client'
    })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    password: string;

    @ApiProperty({ 
        type: Date, 
        description: 'Date de naissance (format: dd/MM/yyyy)',
        example: '12/06/2002',
        required: false
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (!value) return undefined;
        const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
        if (isValid(parsedDate)) {
            return parsedDate.toISOString();
        }
        return value;
    })
    date_naissance?: string;

    @ApiProperty({
        type: String,
        description: 'Genre (Masculin/Féminin)',
        example: 'FEMININ'
    })
    @IsString()
    @IsNotEmpty()
    genre: string;

    @ApiProperty({
        type: String,
        description: 'Avatar URL',
        required: false,
        example: 'image.jpg'
    })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    avatar?: string;

    @ApiProperty({
        type: String,
        description: 'Adresse du client',
        example: 'Cocody'
    })
    @IsString()
    @IsNotEmpty()
    adresse: string;
    
    @ApiProperty({
        type: String,
        description: 'Role du client',
        enum: Role,
        default: Role.CLIENT
    })
    @IsEnum(Role)
    @IsNotEmpty()
    role: Role;
}

// create-boutique.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsObject, IsString } from "class-validator";

export class CreateBoutiqueDto {
    @ApiProperty({
        type: String,
        description: "Référence unique de la boutique",
        example: "BT-2025-001"
    })
    @IsString()
    @IsNotEmpty() 
    reference: string;

    @ApiProperty({
        type: String,
        description: "Nom de la boutique",
        example: "Playce Fashion"
    })
    @IsString()
    @IsNotEmpty()  
    nom: string;

    @ApiProperty({
        type: String,
        description: "Adresse physique de la boutique",
        example: "123 Cocody Boulevard"
    })
    @IsString()
    @IsNotEmpty() 
    adresse: string;

    @ApiProperty({
        type: String,
        description: "Email de contact de la boutique",
        example: "contact@playcefashion.com"
    })
    @IsString()
    @IsEmail()
    @IsNotEmpty() 
    @Transform(({ value }) => value?.trim()) 
    email: string;

    @ApiProperty({
        type: String,
        description: "Numéro de téléphone de la boutique",
        example: "22578123456"
    })
    @IsString()
    @IsNotEmpty() 
    telephone: string;

    @ApiProperty({
        type: Object,
        description: "Réseaux sociaux de la boutique",
        example: {
            instagram: "@playce_fashion",
            facebook: "Playce Fashion Boutique"
        }
    })
    @IsObject() 
    @IsNotEmpty() 
    reseaux: Record<string, string>;

    @ApiProperty({
        type: Object,
        description: "Heures d'ouverture de la boutique",
        example: {
            lundi: "9:00-18:00",
            mardi: "9:00-18:00",
            mercredi: "9:00-18:00",
            jeudi: "9:00-18:00",
            vendredi: "9:00-18:00",
            samedi: "10:00-16:00",
            dimanche: "Fermé"
        }
    })
    @IsObject() 
    @IsNotEmpty() 
    horaire: Record<string, string>;
}

// create-utilisateur.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Genre, Role } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { isValid, parse } from "date-fns";

export class CreateUtilisateurDto {
    @ApiProperty({
        type: String,
        description: 'Nom complet',
        example: 'Soro Guefala'
    })
    @IsNotEmpty()
    @IsString()
    nomComplet: string;

    @ApiProperty({
        type: String,
        description: 'Nom d\'utilisateur',
        example: 'SoFal'
    })
    @IsNotEmpty()
    @IsString()
    nomUtilisateur: string;

    @ApiProperty({
        type: String,
        description: 'Email',
        example: 'Soroguefala@gmail.com'
    })
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    @Transform(({ value }) => value?.trim())
    email: string;

    @ApiProperty({ 
        type: String, 
        description: 'Mot de passe' 
    })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    password: string;

    @ApiProperty({ 
        type: String, 
        description: 'Rôle de l\'utilisateur',
        enum: Role,
        example: 'ADMIN'
    })
    @IsEnum(Role)
    @IsNotEmpty()
    role: Role;

    @ApiProperty({ 
        type: Date, 
        description: 'Date de naissance (format: dd/MM/yyyy)',
        required: false
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (!value) return undefined;
        const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
        if (isValid(parsedDate)) {
            return parsedDate.toISOString();
        }
        return value;
    })
    date_naissance?: string;

    @ApiProperty({ 
        type: String, 
        description: 'Genre',
        enum: Genre,
        example: 'FEMININ'
    })
    @IsEnum(Genre)
    @IsNotEmpty()
    genre: Genre;

    @ApiProperty({ 
        type: String, 
        description: 'Avatar URL',
        required: false
    })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    avatar?: string;
}

// create-variete.dto.ts (nouveau)
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsDecimal, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateVarieteDto {
    @ApiProperty({
        type: String,
        description: 'Référence unique de la variété'
    })
    @IsString()
    @IsNotEmpty()
    reference: string;

    @ApiProperty({
        type: String,
        description: 'Couleur de la variété'
    })
    @IsString()
    @IsNotEmpty()
    couleur: string;

    @ApiProperty({
        type: String,
        description: 'Prix de la variété'
    })
    @IsDecimal()
    @IsNotEmpty()
    prix: number;

    @ApiProperty({
        type: Boolean,
        description: 'Indique si la variété est en promotion'
    })
    @IsBoolean()
    @IsNotEmpty()
    estEnPromotion: boolean;

    @ApiProperty({
        type: String,
        description: 'Prix promotionnel (si applicable)'
    })
    @IsDecimal()
    @IsNotEmpty()
    prixPromotion: number;

    @ApiProperty({
        type: [String],
        description: 'Images de la variété'
    })
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    image: string[];

    @ApiProperty({
        type: String,
        description: 'ID de l\'article parent'
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    article_id: string;
}

// create-disponibilite.dto.ts (nouveau)
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';

export class CreateDisponibiliteDto {
    @ApiProperty({
        type: String,
        description: 'ID de la variété associée'
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    variete_id: string;

    @ApiProperty({
        type: String,
        description: 'ID de la boutique associée'
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    boutique_id: string;

    @ApiProperty({
        type: Number,
        description: 'Quantité disponible'
    })
    @IsInt()
    @IsNotEmpty()
    @Min(0)
    quantite: number;

    @ApiProperty({
        type: Number,
        description: 'Taille disponible'
    })
    @IsInt()
    @IsNotEmpty()
    @Min(0)
    taille: number;
}

// create-categorie.dto.ts (nouveau)
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCategorieDto {
    @ApiProperty({
        type: String,
        description: 'Référence unique de la catégorie'
    })
    @IsString()
    @IsNotEmpty()
    reference: string;

    @ApiProperty({
        type: String,
        description: 'Nom de la catégorie'
    })
    @IsString()
    @IsNotEmpty()
    nom: string;

    @ApiProperty({
        type: String,
        description: 'Description de la catégorie'
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        type: String,
        description: 'ID du type associé'
    })
    @IsString()
    @IsNotEmpty()
    type_id: string;
}

// create-note.dto.ts (nouveau)
import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateNoteDto {
    @ApiProperty({
        type: String,
        description: 'ID du client qui note'
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    client_id: string;

    @ApiProperty({
        type: String,
        description: 'ID de l\'article noté'
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    article_id: string;

    @ApiProperty({
        type: Number,
        description: 'Note attribuée (de 0 à 5)',
        minimum: 0,
        maximum: 5
    })
    @IsDecimal()
    @IsNotEmpty()
    @Min(0)
    @Max(5)
    note: number;

    @ApiProperty({
        type: String,
        description: 'Commentaire'
    })
    @IsString()
    @IsNotEmpty()
    commentaire: string;

    @ApiProperty({
        type: String,
        description: 'ID de la note à laquelle celle-ci répond (optionnel)',
        required: false
    })
    @IsString()
    @IsOptional()
    estUneReponse?: string;
}

// create-favoris.dto.ts (nouveau)
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateFavorisDto {
    @ApiProperty({
        type: String,
        description: 'ID du client'
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    client_id: string;

    @ApiProperty({
        type: String,
        description: 'ID de l\'article'
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    article_id: string;
}

// create-type.dto.ts (nouveau)
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTypeDto {
    @ApiProperty({
        type: String,
        description: 'Référence unique du type'
    })
    @IsString()
    @IsNotEmpty()
    reference: string;

    @ApiProperty({
        type: String,
        description: 'Nom du type'
    })
    @IsString()
    @IsNotEmpty()
    type: string;
}

// utilisateur-boutique.dto.ts (nouveau)
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UtilisateurBoutiqueDto {
    @ApiProperty({
        type: String,
        description: 'ID de l\'utilisateur'
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    utilisateur_id: string;

    @ApiProperty({
        type: String,
        description: 'ID de la boutique'
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    boutique_id: string;

    @ApiProperty({
        type: String,
        description: 'Rôle de l\'utilisateur dans la boutique',
        example: 'GESTIONNAIRE'
    })
    @IsString()
    @IsNotEmpty()
    role: string;
}

// create-collection.dto.ts (nouveau)
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCollectionDto {
    @ApiProperty({
        type: String,
        description: 'Référence unique de la collection'
    })
    @IsString()
    @IsNotEmpty()
    reference: string;

    @ApiProperty({
        type: String,
        description: 'Nom de la collection'
    })
    @IsString()
    @IsNotEmpty()
    nom: string;

    @ApiProperty({
        type: String,
        description: 'Description de la collection'
    })
    @IsString()
    @IsNotEmpty()
    description: string;
}

// categorie-collection.dto.ts (nouveau)
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CategorieCollectionDto {
    @ApiProperty({
        type: String,
        description: 'ID de la catégorie'
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    categorie_id: string;

    @ApiProperty({
        type: String,
        description: 'ID de la collection'
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    collection_id: string;
}

// create-audit.dto.ts (nouveau)
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAuditDto {
    @ApiProperty({
        type: String,
        description: 'ID de l\'utilisateur qui a effectué l\'action'
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    utilisateur_id: string;

    @ApiProperty({
        type: String,
        description: 'Nom de la table concernée'
    })
    @IsString()
    @IsNotEmpty()
    table: string;

    @ApiProperty({
        type: String,
        description: 'ID de l\'enregistrement concerné'
    })
    @IsString()
    @IsNotEmpty()
    table_id: string;

    @ApiProperty({
        type: String,
        description: 'Message décrivant l\'action'
    })
    @IsString()
    @IsNotEmpty()
    message: string;
}