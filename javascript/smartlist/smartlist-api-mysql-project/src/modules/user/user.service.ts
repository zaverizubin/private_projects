import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { User } from '../../entities/user.entity';
import { AssetFile } from 'src/entities/asset-file.entity';
import { CreateUserReqDto } from './dto/request/create-user.req.dto';
import { ChangePasswordReqDto } from './dto/request/change-password.req.dto';
import { UpdateUserReqDto } from './dto/request/update-user.req.dto';
import { plainToClass } from 'class-transformer';
import { UserEmailVerification } from 'src/entities/user-email-verification.entity';
import { CryptoService } from 'src/providers/crypto.service';
import { EmailService } from 'src/providers/email.service';
import { UserRepository } from './user.repository';
import { UserEmailVerificationRepository } from './user.email.verification.repository';
import { Role } from 'src/enums/role';
import { UserForgotPasswordRepository } from './user.forgot.password.repository';
import { UserForgotPassword } from 'src/entities/user-forgot-password.entity';
import { ForgotPasswordResetReqDto } from './dto/request/forgot-password-reset.req.dto';
import { UserRespDto } from './dto/response/user.resp.dto';
import { CreateUserFromInviteReqDto } from './dto/request/create-user-from-invite.req.dto';
import { UserEmailInviteRepository } from './user.email.invite.repository';
import { UserEmailInvite } from 'src/entities/user-email-invite.entity';
import { OrganizationRepository } from '../organization/organization.repository';
import { Organization } from 'src/entities/organization.entity';
import { UserResponseCodes } from './user.response.codes';
import { FileRepository } from '../file/file.repository';
import { TimeoutConfig } from 'src/config/timeout.config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(UserEmailInviteRepository)
    private userEmailInviteRepository: UserEmailInviteRepository,
    @InjectRepository(UserEmailVerificationRepository)
    private userEmailVerificationRepository: UserEmailVerificationRepository,
    @InjectRepository(UserForgotPasswordRepository)
    private userForgotPasswordRepository: UserForgotPasswordRepository,
    @InjectRepository(OrganizationRepository)
    private organizationRepository: OrganizationRepository,
    @InjectRepository(FileRepository)
    private fileRepository: FileRepository,
    private jwtService: JwtService,
    private cryptoService: CryptoService,
    private emailService: EmailService,
  ) { }

  async create(createUserReqDto: CreateUserReqDto): Promise<number> {
    await this.throwIfEmailExists(createUserReqDto.email);

    let user: User = plainToClass(User, createUserReqDto);
    user.role = Role.ADMIN;
    user.password = await this.cryptoService.generatePassword(user.password);
    user = await this.userRepository.save(user);

    const token: string = this.cryptoService.generateToken();
    await this.userEmailVerificationRepository.insertVerifyEmailEntry(
      user,
      token,
    );

    this.emailService.sendVerifyEmailMail(user.email, user.name, token);

    return user.id;
  }

  async createFromInvite(
    createUserFromInviteReqDto: CreateUserFromInviteReqDto,
  ): Promise<number> {
    const userEmailInvite: UserEmailInvite =
      await this.userEmailInviteRepository.findByTokenWithOrganization(
        createUserFromInviteReqDto.token,
      );

    if (userEmailInvite == null) {
      throw UserResponseCodes.INVALID_TOKEN;
    }

    if (
      TimeoutConfig.isExpired(
        userEmailInvite.createdAt,
        TimeoutConfig.EMAIL_INVITE_LINK,
      )
    ) {
      this.userEmailInviteRepository.deleteByToken(
        createUserFromInviteReqDto.token,
      );
      throw UserResponseCodes.TOKEN_EXPIRED;
    }

    await this.throwIfEmailExists(createUserFromInviteReqDto.email);

    let user: User = plainToClass(User, createUserFromInviteReqDto);
    user.role = Role.MEMBER;
    user.password = await this.cryptoService.generatePassword(user.password);
    user.active = true;
    user.organization = userEmailInvite.organization;
    user = await this.userRepository.save(user);

    this.userEmailInviteRepository.deleteByToken(
      createUserFromInviteReqDto.token,
    );

    return user.id;
  }

  async verifyUserEmail(verifyToken: string) {
    const userEmailVerification: UserEmailVerification =
      await this.userEmailVerificationRepository.findByToken(verifyToken);

    if (userEmailVerification == null) {
      throw UserResponseCodes.INVALID_TOKEN;
    }

    if (
      TimeoutConfig.isExpired(
        userEmailVerification.createdAt,
        TimeoutConfig.EMAIL_VERIFY_LINK,
      )
    ) {
      this.userEmailVerificationRepository.deleteByToken(verifyToken);
      throw UserResponseCodes.TOKEN_EXPIRED;
    } else {
      this.userRepository.activateUser(userEmailVerification.user.id);
    }
  }

  async regenerateEmailVerification(emailId: string) {
    const user: User = await this.getUserByEmailOrThrow(emailId);

    if (user.active) {
      throw UserResponseCodes.USER_EMAIL_ALREADY_VERIFIED;
    }

    await this.userEmailVerificationRepository.deleteByUser(user);

    const token: string = this.cryptoService.generateToken();
    await this.userEmailVerificationRepository.insertVerifyEmailEntry(
      user,
      token,
    );

    this.emailService.sendVerifyEmailMail(user.email, user.name, token);
  }

  async verifyAndSendForgotPasswordEmail(email: string) {
    const user: User = await this.userRepository.findByEmail(email);
    if (user == null) {
      throw UserResponseCodes.INVALID_USER_EMAIL_ID;
    }

    const userForgotPassword: UserForgotPassword =
      await this.userForgotPasswordRepository.findByUser(user);

    if (userForgotPassword != null) {
      await this.userForgotPasswordRepository.remove(userForgotPassword);
    }

    const token: string = this.cryptoService.generateToken();
    await this.userForgotPasswordRepository.insertForgotPasswordEntry(
      user,
      token,
    );

    this.emailService.sendForgotPasswordMail(user.email, token);
  }

  async verifyAndResetPassword(
    forgotPasswordResetReqDto: ForgotPasswordResetReqDto,
  ) {
    const userForgotPassword: UserForgotPassword =
      await this.userForgotPasswordRepository.findByToken(
        forgotPasswordResetReqDto.token,
      );
    if (userForgotPassword == null) {
      throw UserResponseCodes.INVALID_TOKEN;
    }
    if (
      TimeoutConfig.isExpired(
        userForgotPassword.createdAt,
        TimeoutConfig.FORGOT_PASSWORD_LINK,
      )
    ) {
      this.userForgotPasswordRepository.remove(userForgotPassword);
      throw UserResponseCodes.TOKEN_EXPIRED;
    } else {
      this.userForgotPasswordRepository.remove(userForgotPassword);

      const user = userForgotPassword.user;
      user.password = await this.cryptoService.generatePassword(
        forgotPasswordResetReqDto.password,
      );
      await this.userRepository.save(user);
    }
  }

  async changePassword(
    userId: number,
    changePasswordReqDto: ChangePasswordReqDto,
  ) {
    const user: User = await this.getUserByIdOrThrow(userId);
    if (
      (await this.cryptoService.comparePassword(
        changePasswordReqDto.old_password,
        user.password,
      )) == false
    ) {
      throw UserResponseCodes.INVALID_USER_ID_OR_PASSWORD;
    }

    const new_password: string = await this.cryptoService.generatePassword(
      changePasswordReqDto.new_password,
    );
    user.password = new_password;
    this.userRepository.save(user);
  }

  async findUserById(userId: number): Promise<UserRespDto> {
    const user: User = await this.getUserByIdOrThrow(userId);
    return new UserRespDto(user);
  }

  async updateUser(userId: number, updateUserReqDto: UpdateUserReqDto) {
    const user: User = await this.getUserByIdOrThrow(userId);

    let photo: AssetFile = null;
    if (updateUserReqDto.photo_id > 0) {
      photo = await this.fileRepository.findOne(updateUserReqDto.photo_id);
      if (photo == null) {
        throw UserResponseCodes.INVALID__PROFILE_PHOTO_FILE_ID;
      }
    }

    user.name = updateUserReqDto.name;
    user.department = updateUserReqDto.department;
    user.designation = updateUserReqDto.designation;
    user.role = updateUserReqDto.role;
    user.photo = photo;

    await this.userRepository.save(user);
  }

  async updateUserOrganization(userId: number, organizationId: number) {
    const user: User = await this.getUserByIdOrThrow(userId);

    const organization: Organization =
      await this.organizationRepository.findById(organizationId);
    if (organization == null) {
      throw UserResponseCodes.INVALID_ORGANIZATION_ID;
    }

    user.organization = organization;
    await this.userRepository.save(user);
  }

  async toggleUserActive(userId: number, status: boolean) {
    const user: User = await this.getUserByIdOrThrow(userId);

    user.active = status;
    await this.userRepository.save(user);
  }

  private async getUserByEmailOrThrow(emailId: string): Promise<User> {
    const user: User = await this.userRepository.findByEmail(emailId);
    if (user == null) {
      throw UserResponseCodes.INVALID_USER_EMAIL_ID;
    }
    return user;
  }

  private async getUserByIdOrThrow(userId: number): Promise<User> {
    const user: User = await this.userRepository.findById(userId);
    if (user == null) {
      throw UserResponseCodes.INVALID_USER_ID;
    }
    return user;
  }

  private async throwIfEmailExists(emailId: string): Promise<boolean> {
    const user: User = await this.userRepository.findByEmail(emailId);
    if (user != null) {
      throw UserResponseCodes.USER_EMAIL_ID_EXISTS;
    }
    return false;
  }
}
