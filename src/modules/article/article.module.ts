import { Module } from '@nestjs/common';
import { ArticleService } from './services/article.service';
import { ArticleController } from './controllers/article.controller';
import { CategorieController } from './controllers/categorie.controller';
import { CategorieService } from './services/categorie.service';
import { VarieteController } from './controllers/variete.controller';
import { VarieteService } from './services/variete.service';

@Module({
  controllers: [ArticleController, CategorieController,VarieteController],
  providers: [ArticleService, CategorieService,VarieteService],
})
export class ArticleModule { }
