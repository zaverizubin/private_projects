import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationReqDto } from './dto/request/create-organization.req.dto';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InviteToOrganizationReqDto } from './dto/request/invite-to-organization.req.dto';
import { OrganizationUserRespDto } from './dto/response/organization-user.resp.dto';
import { UpdateOrganizationReqDto } from './dto/request/update-organization.req.dto';
import { OrganizationRespDto } from './dto/response/organization.resp.dto';
import { OrganizationCancelInviteReqDto } from './dto/request/cancel-invite-to-organization.req.dto';
import { OrganizationUserInviteListRespDto } from './dto/response/organization-user-invite-list.req.dto';
import { OrganizationResponseCodes } from './organization.response.codes';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { Role } from 'src/enums/role';

@ApiTags('Organization')
@Controller('organization')
@UseGuards(RolesGuard)
@Roles(Role.SUPERADMIN, Role.ADMIN, Role.MEMBER)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @ApiOperation({ summary: 'Create an organization' })
  @ApiResponse({ ...OrganizationResponseCodes.CREATED, type: Number })
  @ApiResponse(OrganizationResponseCodes.BAD_REQUEST)
  @ApiResponse(OrganizationResponseCodes.ORGANIZATION_NAME_EXISTS)
  @ApiResponse(OrganizationResponseCodes.INVALID__LOGO_FILE_ID)
  @HttpCode(201)
  @Post()
  async create(
    @Body()
    createOrganizationDto: CreateOrganizationReqDto,
  ): Promise<number> {
    return await this.organizationService.createOrganization(
      createOrganizationDto,
    );
  }

  @ApiOperation({ summary: 'Send email invites for signing up' })
  @ApiResponse(OrganizationResponseCodes.SUCCESS)
  @ApiResponse(OrganizationResponseCodes.BAD_REQUEST)
  @ApiResponse(OrganizationResponseCodes.INVALID_ORGANIZATION_ID)
  @ApiResponse(OrganizationResponseCodes.INVALID_USER_ID)
  @HttpCode(200)
  @Post(':id/invite')
  sendEmailInvites(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    inviteToOrganizationReqDto: InviteToOrganizationReqDto,
  ) {
    return this.organizationService.sendEmailInvites(
      id,
      inviteToOrganizationReqDto,
    );
  }

  @ApiOperation({ summary: 'Get organization' })
  @ApiResponse({
    ...OrganizationResponseCodes.SUCCESS,
    type: OrganizationRespDto,
  })
  @ApiResponse(OrganizationResponseCodes.BAD_REQUEST)
  @ApiResponse(OrganizationResponseCodes.INVALID_ORGANIZATION_ID)
  @HttpCode(200)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrganizationRespDto> {
    return await this.organizationService.getByOrganizationId(id);
  }

  @ApiOperation({ summary: 'Update organization' })
  @ApiResponse(OrganizationResponseCodes.SUCCESS)
  @ApiResponse(OrganizationResponseCodes.BAD_REQUEST)
  @ApiResponse(OrganizationResponseCodes.INVALID_ORGANIZATION_ID)
  @HttpCode(200)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateOrganizationReqDto: UpdateOrganizationReqDto,
  ) {
    return this.organizationService.updateOrganization(
      id,
      updateOrganizationReqDto,
    );
  }

  @ApiOperation({ summary: 'Get organization users' })
  @ApiResponse({
    ...OrganizationResponseCodes.SUCCESS,
    type: [OrganizationUserRespDto],
  })
  @ApiResponse(OrganizationResponseCodes.BAD_REQUEST)
  @ApiResponse(OrganizationResponseCodes.INVALID_ORGANIZATION_ID)
  @HttpCode(200)
  @Get(':id/users')
  async getUsers(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrganizationUserRespDto[]> {
    return await this.organizationService.getUsers(id);
  }

  @ApiOperation({ summary: 'Get organization user invites' })
  @ApiResponse({
    ...OrganizationResponseCodes.SUCCESS,
    type: OrganizationUserInviteListRespDto,
  })
  @ApiResponse(OrganizationResponseCodes.BAD_REQUEST)
  @ApiResponse(OrganizationResponseCodes.INVALID_ORGANIZATION_ID)
  @HttpCode(200)
  @Get(':id/user-invites')
  getUserInvites(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrganizationUserInviteListRespDto> {
    return this.organizationService.getUserInvites(id);
  }

  @ApiOperation({ summary: 'Cancel invite to organization' })
  @ApiResponse(OrganizationResponseCodes.SUCCESS)
  @ApiResponse(OrganizationResponseCodes.BAD_REQUEST)
  @ApiResponse(OrganizationResponseCodes.INVALID_ORGANIZATION_ID)
  @ApiResponse(OrganizationResponseCodes.INVALID_USER_EMAIL_ID)
  @HttpCode(200)
  @Put(':id/cancel-invite')
  cancelInvite(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    cancelInviteToOrganizationReqDto: OrganizationCancelInviteReqDto,
  ) {
    return this.organizationService.cancelInviteToOrganization(
      id,
      cancelInviteToOrganizationReqDto,
    );
  }

  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({
    ...OrganizationResponseCodes.SUCCESS,
    type: OrganizationRespDto,
  })
  @ApiResponse(OrganizationResponseCodes.BAD_REQUEST)
  @Roles(Role.SUPERADMIN)
  @HttpCode(200)
  @Get()
  async getAllOrganizations(): Promise<OrganizationRespDto[]> {
    return await this.organizationService.getAllOrganizations();
  }
}
