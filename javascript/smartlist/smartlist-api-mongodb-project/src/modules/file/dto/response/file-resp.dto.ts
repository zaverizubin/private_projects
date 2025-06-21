import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { AssetFileDocument } from 'src/schemas/asset-file.schema';

export class FileRespDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  url: string;

  constructor(assetFileDocument: AssetFileDocument) {
    this.id = assetFileDocument.id;
    this.url = assetFileDocument.url;
  }
}
