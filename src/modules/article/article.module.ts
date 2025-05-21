import { Module } from '@nestjs/common';
import { ArticleService } from './services/article.service';
import { ArticleController } from './controllers/article.controller';
import { CategorieController } from './controllers/categorie.controller';
import { CategorieService } from './services/categorie.service';

@Module({
  controllers: [ArticleController, CategorieController],
  providers: [ArticleService, CategorieService],
})
export class ArticleModule { }
