import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateUserReqDto } from './dto/request/create-user.req.dto';
import { ForgotPasswordResetReqDto } from './dto/request/forgot-password-reset.req.dto';
import { ForgotPasswordReqDto } from './dto/request/forgot-password.req.dto';
import { ChangePasswordReqDto } from './dto/request/change-password.req.dto';
import { UpdateUserReqDto } from './dto/request/update-user.req.dto';
import { UserService } from './user.service';
import { UserRespDto } from './dto/response/user.resp.dto';
import { CreateUserFromInviteReqDto } from './dto/request/create-user-from-invite.req.dto';
import { UserResponseCodes } from './user.response.codes';
import { RegenerateVerificationEmailReqDto } from './dto/request/regenerate-verification-email.req.dto';
import { Public } from '../auth/jwt-auth.guard';
import { Role } from 'src/enums/role';
import { Roles } from 'src/guards/roles.decorator';

@Controller('/user')
@Roles(Role.SUPERADMIN, Role.ADMIN, Role.MEMBER)
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiProduces('application/text')
  @ApiResponse({ ...UserResponseCodes.CREATED, type: Number })
  @ApiResponse(UserResponseCodes.BAD_REQUEST)
  @ApiResponse(UserResponseCodes.USER_EMAIL_ID_EXISTS)
  @Public()
  @HttpCode(201)
  @Post('create')
  create(@Body() createUserReqDto: CreateUserReqDto): Promise<number> {
    return this.userService.create(createUserReqDto);
  }

  @ApiOperation({ summary: 'Create a new user from email invite' })
  @ApiProduces('application/text')
  @ApiResponse({ ...UserResponseCodes.CREATED, type: Number })
  @ApiResponse(UserResponseCodes.BAD_REQUEST)
  @ApiResponse(UserResponseCodes.TOKEN_EXPIRED)
  @ApiResponse(UserResponseCodes.USER_EMAIL_ID_EXISTS)
  @ApiResponse(UserResponseCodes.INVALID_TOKEN)
  @Public()
  @HttpCode(201)
  @Post('create-from-invite')
  createFromInvite(
    @Body() createUserFromInviteReqDto: CreateUserFromInviteReqDto,
  ): Promise<number> {
    return this.userService.createFromInvite(createUserFromInviteReqDto);
  }

  @ApiOperation({ summary: 'Verify new user email' })
  @ApiResponse(UserResponseCodes.SUCCESS)
  @ApiResponse(UserResponseCodes.BAD_REQUEST)
  @ApiResponse(UserResponseCodes.TOKEN_EXPIRED)
  @ApiResponse(UserResponseCodes.INVALID_TOKEN)
  @Public()
  @HttpCode(200)
  @Put('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.userService.verifyUserEmail(token);
  }

  @ApiOperation({ summary: 'Regenerate email verification' })
  @ApiResponse(UserResponseCodes.SUCCESS)
  @ApiResponse(UserResponseCodes.BAD_REQUEST)
  @ApiResponse(UserResponseCodes.INVALID_USER_EMAIL_ID)
  @Public()
  @HttpCode(200)
  @Put('regenerate-verify-email')
  regenerateEmailVerification(
    @Body()
    regenerateVerificationEmailReqDto: RegenerateVerificationEmailReqDto,
  ) {
    return this.userService.regenerateEmailVerification(
      regenerateVerificationEmailReqDto.email,
    );
  }

  @ApiOperation({ summary: 'Forgot Password' })
  @ApiResponse(UserResponseCodes.SUCCESS)
  @ApiResponse(UserResponseCodes.BAD_REQUEST)
  @ApiResponse(UserResponseCodes.INVALID_USER_EMAIL_ID)
  @Public()
  @HttpCode(200)
  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordReqDto: ForgotPasswordReqDto) {
    return this.userService.verifyAndSendForgotPasswordEmail(
      forgotPasswordReqDto.email,
    );
  }

  @ApiOperation({ summary: 'Reset Forgot Password' })
  @ApiResponse(UserResponseCodes.SUCCESS)
  @ApiResponse(UserResponseCodes.BAD_REQUEST)
  @ApiResponse(UserResponseCodes.TOKEN_EXPIRED)
  @ApiResponse(UserResponseCodes.INVALID_TOKEN)
  @Public()
  @HttpCode(200)
  @Post('forgot-password-reset')
  forgotPasswordReset(
    @Body() forgotPasswordResetReqDto: ForgotPasswordResetReqDto,
  ) {
    return this.userService.verifyAndResetPassword(forgotPasswordResetReqDto);
  }

  @ApiOperation({ summary: 'Change password' })
  @ApiResponse(UserResponseCodes.SUCCESS)
  @ApiResponse(UserResponseCodes.BAD_REQUEST)
  @ApiResponse(UserResponseCodes.INVALID_USER_ID_OR_PASSWORD)
  @HttpCode(200)
  @Post(':id/change-password')
  changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() changePasswordReqDto: ChangePasswordReqDto,
  ) {
    return this.userService.changePassword(id, changePasswordReqDto);
  }

  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({ ...UserResponseCodes.SUCCESS, type: UserRespDto })
  @ApiResponse(UserResponseCodes.BAD_REQUEST)
  @ApiResponse(UserResponseCodes.INVALID_USER_ID)
  @HttpCode(200)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUserById(id);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse(UserResponseCodes.SUCCESS)
  @ApiResponse(UserResponseCodes.BAD_REQUEST)
  @ApiResponse(UserResponseCodes.INVALID_USER_ID)
  @ApiResponse(UserResponseCodes.INVALID__PROFILE_PHOTO_FILE_ID)
  @HttpCode(200)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserReqDto: UpdateUserReqDto,
  ) {
    return this.userService.updateUser(id, updateUserReqDto);
  }

  @ApiOperation({ summary: "Toggle user's active status" })
  @ApiResponse(UserResponseCodes.SUCCESS)
  @ApiResponse(UserResponseCodes.BAD_REQUEST)
  @ApiResponse(UserResponseCodes.INVALID_USER_ID)
  @HttpCode(200)
  @Patch(':id/active/:status')
  setUserActive(
    @Param('id', ParseIntPipe) userId: number,
    @Param('status', ParseBoolPipe) status,
  ) {
    return this.userService.toggleUserActive(userId, status);
  }

  @ApiOperation({ summary: "Update user's organization by id" })
  @ApiResponse(UserResponseCodes.SUCCESS)
  @ApiResponse(UserResponseCodes.BAD_REQUEST)
  @ApiResponse(UserResponseCodes.INVALID_USER_ID)
  @ApiResponse(UserResponseCodes.INVALID_ORGANIZATION_ID)
  @HttpCode(200)
  @Patch(':id/organization/:organizationId')
  updateUserOrganization(
    @Param('id', ParseIntPipe) id: number,
    @Param('organizationId', ParseIntPipe) organizationId: number,
  ) {
    return this.userService.updateUserOrganization(id, organizationId);
  }
}
