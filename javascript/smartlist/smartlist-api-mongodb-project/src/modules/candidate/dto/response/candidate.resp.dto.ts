import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Candidate } from 'src/entities/candidate.entity';
import { CandidateDocument } from 'src/schemas/candidate.schema';

export class CandidateRespDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsInt()
  id: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  contact_number: string;

  @ApiProperty({
    type: Boolean,
  })
  @IsNotEmpty()
  verified: boolean;

  @ApiProperty({
    type: String,
  })
  @IsInt()
  photo_id: string;

  constructor(candidateDocument: CandidateDocument) {
    this.id = candidateDocument.id;
    this.name = candidateDocument.name;
    this.email = candidateDocument.email;
    this.contact_number = candidateDocument.contact_number;
    this.verified = candidateDocument.verified;
    this.photo_id = candidateDocument.photo != null ? candidateDocument.photo.toString() : null;
  }
}
