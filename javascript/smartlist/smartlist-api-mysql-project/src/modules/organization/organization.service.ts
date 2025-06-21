import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Organization } from 'src/entities/organization.entity';
import { User } from 'src/entities/user.entity';
import { AssetFile } from 'src/entities/asset-file.entity';
import { Repository } from 'typeorm';
import { CreateOrganizationReqDto } from './dto/request/create-organization.req.dto';
import { InviteToOrganizationReqDto } from './dto/request/invite-to-organization.req.dto';
import { UpdateOrganizationReqDto } from './dto/request/update-organization.req.dto';
import { OrganizationUserRespDto } from './dto/response/organization-user.resp.dto';
import { OrganizationRespDto } from './dto/response/organization.resp.dto';
import { OrganizationRepository } from './organization.repository';
import { OrganizationCancelInviteReqDto } from './dto/request/cancel-invite-to-organization.req.dto';
import { UserEmailInvite } from 'src/entities/user-email-invite.entity';
import { OrganizationUserInviteListRespDto } from './dto/response/organization-user-invite-list.req.dto';
import { OrganizationResponseCodes } from './organization.response.codes';
import { CryptoService } from 'src/providers/crypto.service';
import { EmailService } from 'src/providers/email.service';
import { FileRepository } from '../file/file.repository';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(OrganizationRepository)
    private organizationRepository: OrganizationRepository,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserEmailInvite)
    private userEmailInviteRepository: Repository<UserEmailInvite>,
    @InjectRepository(FileRepository)
    private fileRepository: FileRepository,
    private cryptoService: CryptoService,
    private emailService: EmailService,
  ) {}

  async createOrganization(
    createOrganizationDto: CreateOrganizationReqDto,
  ): Promise<number> {
    let organization: Organization = await this.organizationRepository.findOne({
      name: createOrganizationDto.name,
    });

    if (organization != null) {
      throw OrganizationResponseCodes.ORGANIZATION_NAME_EXISTS;
    }
    let logo: AssetFile;
    if (createOrganizationDto.logo_id > 0) {
      logo = await this.fileRepository.findOne(createOrganizationDto.logo_id);
      if (logo == null) {
        throw OrganizationResponseCodes.INVALID__LOGO_FILE_ID;
      }
    }

    organization = plainToClass(Organization, createOrganizationDto);
    organization.logo = logo;
    organization = await this.organizationRepository.save(organization);
    return organization.id;
  }

  async updateOrganization(
    id: number,
    updateOrganizationReqDto: UpdateOrganizationReqDto,
  ) {
    let organization: Organization = await this.organizationRepository.findOne({
      name: updateOrganizationReqDto.name,
    });

    if (organization != null && organization.id != id) {
      throw OrganizationResponseCodes.ORGANIZATION_NAME_EXISTS;
    }

    organization = await this.findOrganizationByIdOrThrow(id);
    if (organization == null) {
      throw OrganizationResponseCodes.INVALID_ORGANIZATION_ID;
    }

    let logo: AssetFile = null;
    if (updateOrganizationReqDto.logo_id > 0) {
      logo = await this.fileRepository.findOne(
        updateOrganizationReqDto.logo_id,
      );
      if (logo == null) {
        throw OrganizationResponseCodes.INVALID__LOGO_FILE_ID;
      }
    }

    organization = plainToClass(Organization, updateOrganizationReqDto);
    organization.id = id;
    organization.logo = logo;

    await this.organizationRepository.save(organization);
  }

  async sendEmailInvites(
    id: number,
    inviteToOrganizationReqDto: InviteToOrganizationReqDto,
  ) {
    const organization: Organization = await this.findOrganizationByIdOrThrow(
      id,
    );

    const userInvitee: User = await this.userRepository.findOne(
      inviteToOrganizationReqDto.userId,
    );
    if (userInvitee == null) {
      throw OrganizationResponseCodes.INVALID_USER_ID;
    }

    for (let i = 0; i < inviteToOrganizationReqDto.emails.length; i++) {
      const emailId = inviteToOrganizationReqDto.emails[i];
      const user: User = await this.userRepository.findOne({
        email: emailId,
      });
      if (user != null) {
        continue;
      }
      const exisitingUserEmailInvite: UserEmailInvite =
        await this.userEmailInviteRepository.findOne({
          email: emailId,
        });
      if (exisitingUserEmailInvite != null) {
        continue;
      }

      const userEmailInvite: UserEmailInvite = new UserEmailInvite();
      userEmailInvite.email = emailId;
      userEmailInvite.organization = organization;
      userEmailInvite.token = this.cryptoService.generateToken();
      await this.userEmailInviteRepository.save(userEmailInvite);
      this.emailService.sendInviteToAppMail(
        emailId,
        userInvitee.name,
        userEmailInvite.token,
      );
    }
  }

  async getByOrganizationId(id: number): Promise<OrganizationRespDto> {
    const organization: Organization =
      await this.organizationRepository.findByIdWithRelations(id);

    if (organization == null) {
      throw OrganizationResponseCodes.INVALID_ORGANIZATION_ID;
    }

    return new OrganizationRespDto(organization);
  }

  async getAllOrganizations(): Promise<OrganizationRespDto[]> {
    const organizations: Organization[] =
      await this.organizationRepository.findWithRelations();
    const organizationRespDto: OrganizationRespDto[] = [];
    organizations.forEach((organization) => {
      organizationRespDto.push(new OrganizationRespDto(organization));
    });
    return organizationRespDto;
  }

  async getUsers(id: number): Promise<OrganizationUserRespDto[]> {
    const org: Organization = await this.findOrganizationByIdOrThrow(id);
    const orgUsersRespDtoArray = new Array<OrganizationUserRespDto>();

    const users: User[] = await this.userRepository.find({ organization: org });
    users.forEach(function (user) {
      orgUsersRespDtoArray.push(new OrganizationUserRespDto(user));
    });

    return orgUsersRespDtoArray;
  }

  async getUserInvites(id: number) {
    const org: Organization = await this.findOrganizationByIdOrThrow(id);
    const userEmailInvites: UserEmailInvite[] =
      await this.userEmailInviteRepository.find({
        organization: org,
      });

    return new OrganizationUserInviteListRespDto(userEmailInvites);
  }

  async cancelInviteToOrganization(
    id: number,
    cancelInviteToOrganizationReqDto: OrganizationCancelInviteReqDto,
  ) {
    const org: Organization = await this.findOrganizationByIdOrThrow(id);
    const userEmailInvite: UserEmailInvite =
      await this.userEmailInviteRepository.findOne({
        email: cancelInviteToOrganizationReqDto.email,
        organization: org,
      });
    if (userEmailInvite == null) {
      throw OrganizationResponseCodes.INVALID_USER_EMAIL_ID;
    }
    await this.userEmailInviteRepository.remove(userEmailInvite);
  }

  private async findOrganizationByIdOrThrow(
    organizationId: number,
  ): Promise<Organization> {
    const organization: Organization =
      await this.organizationRepository.findOne(organizationId);
    if (organization == null) {
      throw OrganizationResponseCodes.INVALID_ORGANIZATION_ID;
    }
    return organization;
  }
}
