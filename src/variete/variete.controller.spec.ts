import { Test, TestingModule } from '@nestjs/testing';
import { VarieteController } from './variete.controller';
import { VarieteService } from './variete.service';

describe('VarieteController', () => {
  let controller: VarieteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VarieteController],
      providers: [VarieteService],
    }).compile();

    controller = module.get<VarieteController>(VarieteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
