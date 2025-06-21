import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { REGEX } from 'src/utils/file.utils';
import { FileResponseCodes } from './file.response.codes';
import { FileRespDto } from './dto/response/file-resp.dto';
import { rootDir } from 'root';
import { CryptoService } from 'src/providers/crypto.service';
import * as mime from 'mime-types';

import { AssetFileDocument } from 'src/schemas/asset-file.schema';
import { AssetFileDocumentRepository } from './file.document.repository';

@Injectable()
export class FileService {
  constructor(
    private assetFileDocumentRepository: AssetFileDocumentRepository,

    private configService: ConfigService,
    private cryptoService: CryptoService,
  ) { }

  async findFileById(id: string): Promise<FileRespDto> {
    const assetFileDocument: AssetFileDocument =
      await this.assetFileDocumentRepository.findById(id);

    if (assetFileDocument == null) {
      throw FileResponseCodes.INVALID_FILE_ID;
    }

    const fileRespDto: FileRespDto = new FileRespDto(assetFileDocument);
    return fileRespDto;
  }

  async handleFileUpload(uploadedFile: any): Promise<FileRespDto> {
    if (uploadedFile == null) {
      throw FileResponseCodes.FILE_EMPTY;
    }

    const destination: string = this.getFileDestination(uploadedFile);

    let assetFileDocument: AssetFileDocument = this.getFileEntity(
      uploadedFile,
      destination,
    );
    this.moveFileToDestination(uploadedFile, destination, assetFileDocument);
    assetFileDocument = await this.assetFileDocumentRepository.save(
      assetFileDocument,
    );

    const fileRespDto: FileRespDto = new FileRespDto(assetFileDocument);
    return fileRespDto;
  }

  private getFileDestination(assetFileDocument: any): string {
    if (assetFileDocument.mimetype.match(REGEX.ALLOWED_IMAGE_FILE_EXTENSIONS)) {
      return 'images';
    } else if (
      assetFileDocument.mimetype.match(REGEX.ALLOWED_VIDEO_FILE_EXTENSIONS)
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
    assetFileDocument: AssetFileDocument,
  ): void {
    const dir = path.join(this.assetsBaseDirectory, destination);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.copyFileSync(uploadedFile.path, path.join(dir, assetFileDocument.name));
    fs.unlinkSync(uploadedFile.path);
  }

  public async copyAndSaveFile(
    assetFileDocument: AssetFileDocument,
  ): Promise<AssetFileDocument> {
    const dir = path.join(
      this.assetsBaseDirectory,
      this.getFileDestination(assetFileDocument),
    );
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const copyFilename: string =
      this.cryptoService.generateRandomString() +
      '.' +
      assetFileDocument.name.split('.')[1];

    fs.copyFileSync(
      path.join(dir, assetFileDocument.name),
      path.join(dir, copyFilename),
    );

    const assetFileDocumentCopy: AssetFileDocument =
      this.assetFileDocumentRepository.getModelInstance();
    Object.assign(assetFileDocumentCopy, assetFileDocument);
    assetFileDocumentCopy._id = null;
    assetFileDocumentCopy.created_at = new Date();
    assetFileDocumentCopy.modified_at = new Date();
    assetFileDocumentCopy.name = copyFilename;
    assetFileDocumentCopy.url = path.join(
      this.getFileDestination(assetFileDocument),
      copyFilename,
    );

    await this.assetFileDocumentRepository.save(assetFileDocumentCopy);

    return assetFileDocumentCopy;
  }

  private getFileEntity(
    uploadedFile: any,
    destination: string,
  ): AssetFileDocument {
    const assetFileDocument: AssetFileDocument =
      this.assetFileDocumentRepository.getModelInstance();
    const extension = mime.extension(uploadedFile.mimetype);
    assetFileDocument.original_name = uploadedFile.originalname;
    assetFileDocument.mime_type = uploadedFile.mimetype;
    assetFileDocument.size = uploadedFile.size;
    assetFileDocument.name = `${uploadedFile.filename}.${extension}`;
    assetFileDocument.url = path.join(destination, assetFileDocument.name);

    return assetFileDocument;
  }
}
