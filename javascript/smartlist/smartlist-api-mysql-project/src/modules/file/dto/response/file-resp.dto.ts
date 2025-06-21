import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { AssetFile } from '../../../../entities/asset-file.entity';

export class FileRespDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  url: string;

  constructor(file: AssetFile) {
    this.id = file.id;
    this.url = file.url;
  }
}
