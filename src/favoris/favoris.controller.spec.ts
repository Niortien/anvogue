import { FavorisService } from './../modules/client/services/favoris.service';
import { Test, TestingModule } from '@nestjs/testing';
import { FavorisController } from '../modules/client/controller/favoris.controller';


describe('FavorisController', () => {
  let controller: FavorisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavorisController],
      providers: [FavorisService],
    }).compile();

    controller = module.get<FavorisController>(FavorisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
