import { EntityRepository, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { CandidateAttemptLog } from 'src/entities/candidate-attempt-log.entity';

@Injectable()
@EntityRepository(CandidateAttemptLog)
export class CandidateAttemptLogRepository extends Repository<CandidateAttemptLog> {
  constructor() {
    super();
  }
}
