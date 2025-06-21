import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FileRepository } from './file.repository';
import { AssetFile } from '../../entities/asset-file.entity';
import { REGEX } from 'src/utils/file.utils';
import { FileResponseCodes } from './file.response.codes';
import { FileRespDto } from './dto/response/file-resp.dto';
import { rootDir } from 'root';
import { CryptoService } from 'src/providers/crypto.service';
import * as mime from 'mime-types';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileRepository)
    private fileRepository: FileRepository,
    private configService: ConfigService,
    private cryptoService: CryptoService,
  ) {}

  async handleFileUpload(uploadedFile: any): Promise<FileRespDto> {
    if (uploadedFile == null) {
      throw FileResponseCodes.FILE_EMPTY;
    }

    const destination: string = this.getFileDestination(uploadedFile);

    let file: AssetFile = this.getFileEntity(uploadedFile, destination);
    this.moveFileToDestination(uploadedFile, destination, file);
    file = await this.fileRepository.save(file);

    const fileRespDto: FileRespDto = new FileRespDto(file);
    return fileRespDto;
  }

  async findFileById(id: number): Promise<FileRespDto> {
    const file: AssetFile = await this.fileRepository.findOne(id);

    if (file == null) {
      throw FileResponseCodes.INVALID_FILE_ID;
    }

    const fileRespDto: FileRespDto = new FileRespDto(file);
    return fileRespDto;
  }

  private getFileDestination(uploadedFile: any): string {
    if (uploadedFile.mimetype.match(REGEX.ALLOWED_IMAGE_FILE_EXTENSIONS)) {
      return 'images';
    } else if (
      uploadedFile.mimetype.match(REGEX.ALLOWED_VIDEO_FILE_EXTENSIONS)
    ) {
      return 'videos';
    } else {
      return 'file';
    }
  }

  public get assetsBaseDirectory(): string {
    return path.join(rootDir(), this.configService.get('UPLOADS_FOLDER_PATH'));
  }

  private moveFileToDestination(
    uploadedFile: any,
    destination: string,
    fileEntity: AssetFile,
  ): void {
    const dir = path.join(this.assetsBaseDirectory, destination);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.copyFileSync(uploadedFile.path, path.join(dir, fileEntity.name));
    fs.unlinkSync(uploadedFile.path);
  }

  public async copyAndSaveFile(assetFile: AssetFile): Promise<AssetFile> {
    const dir = path.join(
      this.assetsBaseDirectory,
      this.getFileDestination(assetFile),
    );
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const copyFilename: string =
      this.cryptoService.generateRandomString() +
      '.' +
      assetFile.name.split('.')[1];

    fs.copyFileSync(
      path.join(dir, assetFile.name),
      path.join(dir, copyFilename),
    );

    const assetFileCopy: AssetFile = new AssetFile();
    Object.assign(assetFileCopy, assetFile);
    assetFileCopy.id = null;
    assetFileCopy.createdAt = new Date();
    assetFileCopy.modifiedAt = new Date();
    assetFileCopy.name = copyFilename;
    assetFileCopy.url = path.join(
      this.getFileDestination(assetFile),
      copyFilename,
    );

    await this.fileRepository.save(assetFileCopy);

    return assetFileCopy;
  }

  private getFileEntity(uploadedFile: any, destination: string): AssetFile {
    const file: AssetFile = new AssetFile();
    const extension = mime.extension(uploadedFile.mimetype);
    file.originalName = uploadedFile.originalname;
    file.mimetype = uploadedFile.mimetype;
    file.size = uploadedFile.size;
    file.name = `${uploadedFile.filename}.${extension}`;
    file.url = path.join(destination, file.name);

    return file;
  }

  private getExtention(fileName: string) {
    const i = fileName.lastIndexOf('.');
    if (i == -1) {
      return 'mp4';
    }
    return fileName.slice(i + 1);
  }
}
