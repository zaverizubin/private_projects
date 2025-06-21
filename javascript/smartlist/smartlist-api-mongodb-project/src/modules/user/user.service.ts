import { Injectable } from '@nestjs/common';
import { CreateUserReqDto } from './dto/request/create-user.req.dto';
import { ChangePasswordReqDto } from './dto/request/change-password.req.dto';
import { UpdateUserReqDto } from './dto/request/update-user.req.dto';
import { CryptoService } from 'src/providers/crypto.service';
import { EmailService } from 'src/providers/email.service';
import { UserResponseCodes } from './user.response.codes';
import { TimeoutConfig } from 'src/config/timeout.config';
import { OrganizationDocumentRepository } from '../organization/organization.document.repository';
import { UserDocumentRepository } from './user.document.repository';
import { UserDocument } from 'src/schemas/user.schema';
import { AssetFileDocumentRepository } from '../file/file.document.repository';
import { AssetFileDocument } from 'src/schemas/asset-file.schema';
import { OrganizationDocument } from 'src/schemas/organization.schema';
import { Role } from 'src/enums/role';
import { UserRespDto } from './dto/response/user.resp.dto';
import { ForgotPasswordResetReqDto } from './dto/request/forgot-password-reset.req.dto';
import { CreateUserFromInviteReqDto } from './dto/request/create-user-from-invite.req.dto';
import { UserInviteDocumentRepository } from './user.invite.document.repository';
import { UserInviteDocument } from 'src/schemas/user-invite.schema';

@Injectable()
export class UserService {
  constructor(
    private userDocumentRepository: UserDocumentRepository,
    private userInviteDocumentRepository: UserInviteDocumentRepository,
    private organizationDocumentRepository: OrganizationDocumentRepository,
    private assetFileDocumentRepository: AssetFileDocumentRepository,

    private cryptoService: CryptoService,
    private emailService: EmailService,
  ) { }

  async create(createUserReqDto: CreateUserReqDto): Promise<string> {
    await this.throwIfEmailExists(createUserReqDto.email);

    let userDocument: UserDocument =
      await this.getUserDocumentFromCreateUserReqDto(createUserReqDto);

    userDocument = await this.userDocumentRepository.save(userDocument);

    this.emailService.sendVerifyEmailMail(
      userDocument.email,
      userDocument.name,
      userDocument.email_verification.token,
    );

    return userDocument.id;
  }

  async createFromInvite(
    createUserFromInviteReqDto: CreateUserFromInviteReqDto,
  ): Promise<string> {
    const userInviteDocument: UserInviteDocument =
      await this.userInviteDocumentRepository.findByToken(
        createUserFromInviteReqDto.token,
      );

    if (userInviteDocument == null) {
      throw UserResponseCodes.INVALID_TOKEN;
    }

    if (
      TimeoutConfig.isExpired(
        userInviteDocument.created_at,
        TimeoutConfig.EMAIL_INVITE_LINK,
      )
    ) {
      this.userInviteDocumentRepository.delete(userInviteDocument);
      throw UserResponseCodes.TOKEN_EXPIRED;
    }

    await this.throwIfEmailExists(createUserFromInviteReqDto.email);

    let userDocument: UserDocument = await this.getUserDocumentFromInviteDto(
      createUserFromInviteReqDto,
    );
    userDocument.organizationDocument = userInviteDocument.organizationDocument;
    userDocument = await this.userDocumentRepository.save(userDocument);

    this.userInviteDocumentRepository.delete(userInviteDocument);

    return userDocument.id;
  }

  async verifyUserEmail(verifyToken: string) {
    const userDocument: UserDocument =
      await this.userDocumentRepository.findByEmailVerificationToken(
        verifyToken,
      );

    if (userDocument == null) {
      throw UserResponseCodes.INVALID_TOKEN;
    }

    if (
      TimeoutConfig.isExpired(
        userDocument.email_verification.created_at,
        TimeoutConfig.EMAIL_VERIFY_LINK,
      )
    ) {
      userDocument.email_verification = null;
      this.userDocumentRepository.save(userDocument);
      throw UserResponseCodes.TOKEN_EXPIRED;
    } else {
      userDocument.email_verification = null;
      userDocument.active = true;
      this.userDocumentRepository.save(userDocument);
    }
  }

  async regenerateEmailVerification(emailId: string) {
    const userDocument: UserDocument =
      await this.userDocumentRepository.findByEmail(emailId);
    if (userDocument == null) {
      throw UserResponseCodes.INVALID_USER_EMAIL_ID;
    }

    if (userDocument.active) {
      throw UserResponseCodes.USER_EMAIL_ALREADY_VERIFIED;
    }

    userDocument.email_verification = {
      token: this.cryptoService.generateToken(),
      created_at: Date.now(),
    };
    this.userDocumentRepository.save(userDocument);

    this.emailService.sendVerifyEmailMail(
      userDocument.email,
      userDocument.name,
      userDocument.email_verification.token,
    );
  }

  async verifyAndSendForgotPasswordEmail(email: string) {
    const userDocument: UserDocument =
      await this.userDocumentRepository.findByEmail(email);
    if (userDocument == null) {
      throw UserResponseCodes.INVALID_USER_EMAIL_ID;
    }

    userDocument.forgot_password = {
      token: this.cryptoService.generateToken(),
      created_at: Date.now(),
    };
    this.userDocumentRepository.save(userDocument);

    this.emailService.sendForgotPasswordMail(
      userDocument.email,
      userDocument.email_verification.token,
    );
  }

  async verifyAndResetPassword(
    forgotPasswordResetReqDto: ForgotPasswordResetReqDto,
  ) {
    const userDocument: UserDocument =
      await this.userDocumentRepository.findByForgotPasswordToken(
        forgotPasswordResetReqDto.token,
      );
    if (userDocument == null) {
      throw UserResponseCodes.INVALID_TOKEN;
    }
    if (
      TimeoutConfig.isExpired(
        userDocument.forgot_password.created_at,
        TimeoutConfig.FORGOT_PASSWORD_LINK,
      )
    ) {
      userDocument.forgot_password = null;
      this.userDocumentRepository.save(userDocument);
      throw UserResponseCodes.TOKEN_EXPIRED;
    } else {
      userDocument.forgot_password = null;
      userDocument.password = await this.cryptoService.generatePassword(
        forgotPasswordResetReqDto.password,
      );

      await this.userDocumentRepository.save(userDocument);
    }
  }

  async changePassword(
    userId: string,
    changePasswordReqDto: ChangePasswordReqDto,
  ) {
    const userDocument: UserDocument = await this.getUserByIdOrThrow(userId);
    if (
      (await this.cryptoService.comparePassword(
        changePasswordReqDto.old_password,
        userDocument.password,
      )) == false
    ) {
      throw UserResponseCodes.INVALID_USER_ID_OR_PASSWORD;
    }

    const new_password: string = await this.cryptoService.generatePassword(
      changePasswordReqDto.new_password,
    );
    userDocument.password = new_password;
    this.userDocumentRepository.save(userDocument);
  }

  async findUserById(userId: string): Promise<UserRespDto> {
    const userDocument: UserDocument = await this.getUserByIdOrThrow(userId);
    return new UserRespDto(userDocument);
  }

  async updateUser(userId: string, updateUserReqDto: UpdateUserReqDto) {
    const userDocument: UserDocument = await this.getUserByIdOrThrow(userId);

    let assetFileDocument: AssetFileDocument = null;
    if (updateUserReqDto.photo_id != '') {
      assetFileDocument = await this.assetFileDocumentRepository.findById(
        updateUserReqDto.photo_id,
      );
      if (assetFileDocument == null) {
        throw UserResponseCodes.INVALID__PROFILE_PHOTO_FILE_ID;
      }
    }

    userDocument.name = updateUserReqDto.name;
    userDocument.department = updateUserReqDto.department;
    userDocument.designation = updateUserReqDto.designation;
    userDocument.role = updateUserReqDto.role;
    userDocument.photo =
      assetFileDocument != null ? assetFileDocument.id : null;

    await this.userDocumentRepository.save(userDocument);
  }

  async updateUserOrganization(userId: string, organizationId: string) {
    const userDocument: UserDocument = await this.getUserByIdOrThrow(userId);

    const organizationDocument: OrganizationDocument =
      await this.organizationDocumentRepository.findById(organizationId);
    if (organizationDocument == null) {
      throw UserResponseCodes.INVALID_ORGANIZATION_ID;
    }

    userDocument.organizationDocument = organizationDocument.id;
    await this.userDocumentRepository.save(userDocument);
  }

  async toggleUserActive(userId: string, status: boolean) {
    const userDocument: UserDocument = await this.getUserByIdOrThrow(userId);

    userDocument.active = status;
    await this.userDocumentRepository.save(userDocument);
  }

  private async getUserByIdOrThrow(userId: string): Promise<UserDocument> {
    const userDocument: UserDocument =
      await this.userDocumentRepository.findById(userId);
    if (userDocument == null) {
      throw UserResponseCodes.INVALID_USER_ID;
    }
    return userDocument;
  }

  private async throwIfEmailExists(emailId: string) {
    const userDocument: UserDocument =
      await this.userDocumentRepository.findByEmail(emailId);
    if (userDocument != null) {
      throw UserResponseCodes.USER_EMAIL_ID_EXISTS;
    }
  }

  private async getUserDocumentFromCreateUserReqDto(
    createUserReqDto: CreateUserReqDto,
  ): Promise<UserDocument> {
    const userDocument: UserDocument =
      this.userDocumentRepository.getModelInstance();

    userDocument.name = createUserReqDto.name;
    userDocument.email = createUserReqDto.email;
    userDocument.password = await this.cryptoService.generatePassword(
      createUserReqDto.password,
    );
    userDocument.role = Role.ADMIN;
    userDocument.active = false;
    userDocument.department = '';
    userDocument.designation = '';
    userDocument.photo = null;
    userDocument.organizationDocument = null;
    userDocument.forgot_password = null;

    userDocument.email_verification = {
      token: this.cryptoService.generateToken(),
      created_at: Date.now(),
    };
    return userDocument;
  }

  private async getUserDocumentFromInviteDto(
    createUserFromInviteReqDto: CreateUserFromInviteReqDto,
  ): Promise<UserDocument> {
    const userDocument: UserDocument =
      this.userDocumentRepository.getModelInstance();

    userDocument.name = createUserFromInviteReqDto.name;
    userDocument.email = createUserFromInviteReqDto.email;
    userDocument.password = await this.cryptoService.generatePassword(
      createUserFromInviteReqDto.password,
    );
    userDocument.role = Role.MEMBER;
    userDocument.active = true;
    userDocument.department = '';
    userDocument.designation = '';
    userDocument.photo = null;
    userDocument.organizationDocument = null;
    userDocument.forgot_password = null;
    userDocument.email_verification = null;

    return userDocument;
  }
}
