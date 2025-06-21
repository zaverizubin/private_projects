import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from './report.assessment.controller';
import { ReportService } from './report.assessment.service';

describe('ReportOrganizationController', () => {
  let controller: ReportOrganizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportOrganizationController],
      providers: [ReportOrganizationService],
    }).compile();

    controller = module.get<ReportOrganizationController>(ReportOrganizationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
