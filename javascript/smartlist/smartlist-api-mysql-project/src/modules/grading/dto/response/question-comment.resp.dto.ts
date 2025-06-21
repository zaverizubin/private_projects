import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { QuestionComment } from 'src/entities/question-comment.entity';
export class QuestionCommentRespDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  comment: string;

  constructor(questionComment: QuestionComment) {
    this.username = questionComment.username;
    this.comment = questionComment.comment;
  }
}
