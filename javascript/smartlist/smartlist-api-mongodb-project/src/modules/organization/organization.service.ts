import { Injectable } from '@nestjs/common';
import { OrganizationReqDto } from './dto/request/organization.req.dto';
import { InviteToOrganizationReqDto } from './dto/request/invite-to-organization.req.dto';
import { OrganizationUserRespDto } from './dto/response/organization-user.resp.dto';
import { OrganizationRespDto } from './dto/response/organization.resp.dto';
import { OrganizationCancelInviteReqDto } from './dto/request/cancel-invite-to-organization.req.dto';
import { OrganizationUserInviteListRespDto } from './dto/response/organization-user-invite-list.req.dto';
import { OrganizationResponseCodes } from './organization.response.codes';
import { CryptoService } from 'src/providers/crypto.service';
import { EmailService } from 'src/providers/email.service';
import { OrganizationDocumentRepository } from './organization.document.repository';
import { OrganizationDocument } from 'src/schemas/organization.schema';
import { AssetFileDocument } from 'src/schemas/asset-file.schema';
import { AssetFileDocumentRepository } from '../file/file.document.repository';
import { UserDocumentRepository } from '../user/user.document.repository';
import { UserDocument } from 'src/schemas/user.schema';
import { UserInviteDocument } from 'src/schemas/user-invite.schema';
import { UserInviteDocumentRepository } from '../user/user.invite.document.repository';

@Injectable()
export class OrganizationService {
  constructor(
    private organizationDocumentRepository: OrganizationDocumentRepository,
    private assetFileDocumentRepository: AssetFileDocumentRepository,
    private userDocumentRepository: UserDocumentRepository,
    private userInviteDocumentRepository: UserInviteDocumentRepository,

    private cryptoService: CryptoService,
    private emailService: EmailService,
  ) { }

  async createOrganization(
    createOrganizationDto: OrganizationReqDto,
  ): Promise<string> {
    let organizationDocument: OrganizationDocument =
      await this.organizationDocumentRepository.findByName(
        createOrganizationDto.name,
      );

    if (organizationDocument != null) {
      throw OrganizationResponseCodes.ORGANIZATION_NAME_EXISTS;
    }

    organizationDocument = this.getDocumentFromOrganizationReqDto(
      createOrganizationDto,
    );

    let logo: AssetFileDocument = null;
    if (createOrganizationDto.logo_id != null) {
      logo = await this.assetFileDocumentRepository.findById(
        createOrganizationDto.logo_id,
      );
      if (logo == null) {
        throw OrganizationResponseCodes.INVALID__LOGO_FILE_ID;
      }
    }
    organizationDocument.logo = logo;

    await this.organizationDocumentRepository.save(organizationDocument);
    return organizationDocument.id;
  }

  async updateOrganization(id: string, organizationReqDto: OrganizationReqDto) {
    let organizationDocument: OrganizationDocument =
      await this.findOrganizationByIdOrThrow(id);

    organizationDocument = await this.organizationDocumentRepository.findByName(
      organizationReqDto.name,
    );

    if (organizationDocument != null && organizationDocument.id != id) {
      throw OrganizationResponseCodes.ORGANIZATION_NAME_EXISTS;
    }

    let logo: AssetFileDocument = null;
    if (organizationReqDto.logo_id != null) {
      logo = await this.assetFileDocumentRepository.findById(
        organizationReqDto.logo_id,
      );
      if (logo == null) {
        throw OrganizationResponseCodes.INVALID__LOGO_FILE_ID;
      }
    }

    organizationDocument =
      this.getDocumentFromOrganizationReqDto(organizationReqDto);
    organizationDocument._id = id;
    organizationDocument.logo = logo;
    organizationDocument.isNew = false;
    await this.organizationDocumentRepository.save(organizationDocument);
  }

  async getByOrganizationId(id: string): Promise<OrganizationRespDto> {
    const organizationDocument: OrganizationDocument =
      await this.organizationDocumentRepository.findById(id);

    if (organizationDocument == null) {
      throw OrganizationResponseCodes.INVALID_ORGANIZATION_ID;
    }

    return new OrganizationRespDto(organizationDocument);
  }

  async getAllOrganizations(): Promise<OrganizationRespDto[]> {
    const organizationDocuments: OrganizationDocument[] =
      await this.organizationDocumentRepository.findAll();
    const organizationRespDto: OrganizationRespDto[] = [];
    organizationDocuments.forEach(organizationDocument => {
      organizationRespDto.push(new OrganizationRespDto(organizationDocument));
    });
    return organizationRespDto;
  }

  async getUsers(organizationId: string): Promise<OrganizationUserRespDto[]> {
    const organizationDocument: OrganizationDocument =
      await this.findOrganizationByIdOrThrow(organizationId);
    const orgUsersRespDtoArray = new Array<OrganizationUserRespDto>();

    const userDocuments: UserDocument[] =
      await this.userDocumentRepository.findAllByOrganization(
        organizationDocument,
      );
    userDocuments.forEach(userDocument =>
      orgUsersRespDtoArray.push(new OrganizationUserRespDto(userDocument)));


    return orgUsersRespDtoArray;
  }

  async sendEmailInvites(
    organizationId: string,
    inviteToOrganizationReqDto: InviteToOrganizationReqDto,
  ) {
    const organizationDocument: OrganizationDocument =
      await this.findOrganizationByIdOrThrow(organizationId);

    const userInviteeDocument: UserDocument =
      await this.userDocumentRepository.findById(
        inviteToOrganizationReqDto.userId,
      );
    if (userInviteeDocument == null) {
      throw OrganizationResponseCodes.INVALID_USER_ID;
    }

    for (let i = 0; i < inviteToOrganizationReqDto.emails.length; i++) {
      const emailId = inviteToOrganizationReqDto.emails[i];
      const userDocument: UserDocument =
        await this.userDocumentRepository.findByEmail(emailId);
      if (userDocument != null) {
        continue;
      }
      const existingUserInviteDocument: UserInviteDocument =
        await this.userInviteDocumentRepository.findByEmail(emailId);
      if (existingUserInviteDocument != null) {
        continue;
      }

      const userInviteDocument: UserInviteDocument =
        this.userInviteDocumentRepository.getModelInstance();
      userInviteDocument.email = emailId;
      userInviteDocument.organizationDocument = organizationDocument.id;
      userInviteDocument.token = this.cryptoService.generateToken();
      await this.userInviteDocumentRepository.save(userInviteDocument);

      this.emailService.sendInviteToAppMail(
        emailId,
        userInviteeDocument.name,
        userInviteDocument.token,
      );
    }
  }

  async getUserInvites(organizationId: string) {
    const organizationDocument: OrganizationDocument =
      await this.findOrganizationByIdOrThrow(organizationId);
    const userInviteDocuments: UserInviteDocument[] =
      await this.userInviteDocumentRepository.findAllByOrganization(
        organizationDocument,
      );

    return new OrganizationUserInviteListRespDto(userInviteDocuments);
  }

  async cancelInviteToOrganization(
    organizationId: string,
    cancelInviteToOrganizationReqDto: OrganizationCancelInviteReqDto,
  ) {
    const organizationDocument: OrganizationDocument =
      await this.findOrganizationByIdOrThrow(organizationId);
    const userInviteDocument: UserInviteDocument =
      await this.userInviteDocumentRepository.findByEmailAndOrganization(
        cancelInviteToOrganizationReqDto.email,
        organizationDocument,
      );
    if (userInviteDocument == null) {
      throw OrganizationResponseCodes.INVALID_USER_EMAIL_ID;
    }
    await this.userInviteDocumentRepository.delete(userInviteDocument);
  }

  private async findOrganizationByIdOrThrow(
    organizationId: string,
  ): Promise<OrganizationDocument> {
    const organizationDocument: OrganizationDocument =
      await this.organizationDocumentRepository.findById(organizationId);
    if (organizationDocument == null) {
      throw OrganizationResponseCodes.INVALID_ORGANIZATION_ID;
    }
    return organizationDocument;
  }

  private getDocumentFromOrganizationReqDto(
    organizationReqDto: OrganizationReqDto,
  ): OrganizationDocument {
    const organizationDocument: OrganizationDocument =
      this.organizationDocumentRepository.getModelInstance();

    organizationDocument.name = organizationReqDto.name;
    organizationDocument.contact_number = organizationReqDto.contact_number;
    organizationDocument.about = organizationReqDto.about;
    organizationDocument.email = organizationReqDto.email;
    organizationDocument.url = organizationReqDto.url;
    return organizationDocument;
  }
}
