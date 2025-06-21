import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Candidate } from 'src/entities/candidate.entity';

export class CandidateRespDto {
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
    type: Number,
  })
  @IsInt()
  photo_id: number;

  constructor(candidate: Candidate) {
    this.id = candidate.id;
    this.name = candidate.name;
    this.email = candidate.email;
    this.contact_number = candidate.contactNumber;
    this.verified = candidate.verified;
    this.photo_id = candidate.photo != null ? candidate.photo.id : null;
  }
}
