import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';

export class CreateOrganizationReqDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsUrl()
  @IsOptional()
  url: string;

  @ApiProperty()
  @ValidateIf((o) => o.email != null)
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  contact_number: string;

  @ApiPropertyOptional()
  @IsOptional()
  about: string;

  @ApiPropertyOptional({
    type: Number,
  })
  @ValidateIf((o) => o.logo_id != null)
  @IsInt()
  logo_id: number;
}
