import { EntityRepository, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CandidateSmsLog } from 'src/entities/sms-log.entity';

@Injectable()
@EntityRepository(CandidateSmsLog)
export class CandidateSmsLogRepository extends Repository<CandidateSmsLog> {}
