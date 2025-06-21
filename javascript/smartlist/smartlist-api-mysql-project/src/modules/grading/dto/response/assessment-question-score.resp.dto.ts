import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CandidateResponseScore } from 'src/entities/candidate-response-score.entity';
export class AssessmentQuestionScoreRespDto {
  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  candidate_id: number;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  assessment_id: number;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  assessment_block_id: number;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  question_id: number;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  score: number;

  constructor(candidateResponseScore: CandidateResponseScore) {
    this.candidate_id = candidateResponseScore.candidate.id;
    this.assessment_id = candidateResponseScore.assessment.id;
    this.assessment_block_id = candidateResponseScore.assessmentBlock.id;
    this.question_id = candidateResponseScore.question.id;
    this.score = candidateResponseScore.score;
  }
}
