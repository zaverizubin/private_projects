import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiFile } from 'src/utils/swagger.ext';
import { fileConfig } from '../../config/file.config';
import { FileRespDto } from './dto/response/file-resp.dto';
import { FileResponseCodes } from './file.response.codes';
import { FileService } from './file.service';

@Controller('file')
@ApiTags('File')
export class FilesController {
  constructor(private fileService: FileService) {}

  @ApiOperation({ summary: 'Get file url by id' })
  @ApiResponse({ ...FileResponseCodes.SUCCESS, type: FileRespDto })
  @ApiResponse(FileResponseCodes.BAD_REQUEST)
  @ApiResponse(FileResponseCodes.INVALID_FILE_ID)
  @HttpCode(200)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<FileRespDto> {
    return this.fileService.findFileById(id);
  }

  @ApiOperation({ summary: 'Upload a file' })
  @ApiFile()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', fileConfig))
  @ApiResponse(FileResponseCodes.BAD_REQUEST)
  @ApiResponse(FileResponseCodes.FILE_UNSUPPORTED)
  @ApiResponse(FileResponseCodes.FILE_EMPTY)
  @Post('/upload')
  async uploadFile(@UploadedFile() uploadedFile): Promise<FileRespDto> {
    return await this.fileService.handleFileUpload(uploadedFile);
  }

  @ApiOperation({ summary: 'Download a file' })
  @Get('download/*')
  async viewfile(@Req() req, @Res() res) {
    const fileName = req.params[0];
    if (!fileName || fileName === '*') {
      throw new HttpException('Not a valid file.', HttpStatus.NOT_FOUND);
    }
    const options = {
      root: this.fileService.assetsBaseDirectory,
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true,
      },
    };
    return res.sendFile(fileName, options);
  }
}
