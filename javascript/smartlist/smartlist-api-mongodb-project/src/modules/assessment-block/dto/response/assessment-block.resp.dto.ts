import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';
import { AssessmentBlockDocument } from 'src/schemas/assessment-block.schema';
import { QuestionDocument } from 'src/schemas/question.schema';

export class AssessmentBlockRespDto {
  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  id: number;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  instruction: string;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  duration: number;

  @ApiProperty({
    type: String,
  })
  closing_comments: string;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  points: number;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  sort_order: number;

  @ApiProperty({
    type: Number,
  })
  @IsInt()
  random_questions: number;

  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  shuffle_questions: boolean;

  constructor(
    assessmentBlockDocument: AssessmentBlockDocument,
    questionDocuments: QuestionDocument[],
  ) {
    this.id = assessmentBlockDocument.id;
    this.title = assessmentBlockDocument.title;
    this.instruction = assessmentBlockDocument.instruction;
    this.duration = assessmentBlockDocument.duration;
    this.closing_comments = assessmentBlockDocument.closing_comments;
    this.points = 0;
    this.sort_order = assessmentBlockDocument.sort_order;
    this.shuffle_questions = assessmentBlockDocument.shuffle_questions;
    this.random_questions = assessmentBlockDocument.random_questions;
    if (assessmentBlockDocument.shuffle_questions) {
      questionDocuments = questionDocuments.slice(
        0,
        Math.min(
          assessmentBlockDocument.random_questions,
          questionDocuments.length,
        ),
      );
    }
    questionDocuments.forEach((question) => {
      this.points += question.score;
    });
  }
}
