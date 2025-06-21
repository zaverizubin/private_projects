import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { QuestionCommentDocument } from 'src/schemas/question-comment.schema';
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

  constructor(questionCommentDocument: QuestionCommentDocument) {
    this.username = questionCommentDocument.username;
    this.comment = questionCommentDocument.comment;
  }
}
