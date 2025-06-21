import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  ValidateIf,
} from 'class-validator';

export class OrganizationReqDto {
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
    type: String,
  })
  @ValidateIf((o) => o.logo_id != null)
  logo_id: string;
}
