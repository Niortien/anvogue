import { Test, TestingModule } from '@nestjs/testing';
import { VarieteService } from '../modules/article/services/variete.service';

describe('VarieteService', () => {
  let service: VarieteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VarieteService],
    }).compile();

    service = module.get<VarieteService>(VarieteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
