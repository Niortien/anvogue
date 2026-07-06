import { Module } from '@nestjs/common';
import { ArticleService } from './services/article.service';
import { ArticleController } from './controllers/article.controller';
import { CategorieController } from './controllers/categorie.controller';
import { CategorieService } from './services/categorie.service';
import { CollectionController } from './controllers/collection.controller';
import { CollectionService } from './services/collection.service';
import { VarieteController } from './controllers/variete.controller';
import { VarieteService } from './services/variete.service';

@Module({
  controllers: [ArticleController, CategorieController, CollectionController, VarieteController],
  providers: [ArticleService, CategorieService, CollectionService, VarieteService],
})
export class ArticleModule { }
