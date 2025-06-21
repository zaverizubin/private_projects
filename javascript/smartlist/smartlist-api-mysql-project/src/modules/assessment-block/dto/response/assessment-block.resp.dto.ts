import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { AssessmentBlock } from 'src/entities/assessment-block.entity';

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
  closing_comment: string;

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

  constructor(assessmentBlock: AssessmentBlock) {
    this.id = assessmentBlock.id;
    this.title = assessmentBlock.title;
    this.instruction = assessmentBlock.instruction;
    this.duration = assessmentBlock.duration;
    this.closing_comment = assessmentBlock.closingComments;
    this.points = 0;
    this.sort_order = assessmentBlock.sortOrder;
    assessmentBlock.questions.forEach((question) => {
      this.points += question.score;
    });
  }
}
