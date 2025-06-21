import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AssessmentResponseCodes } from './assessment.response.codes';
import { AssessmentService } from './assessment.service';
import { AssessmentReqDto } from './dto/request/assessment.req.dto';
import { AssessmentRespDto } from './dto/response/assessment.resp.dto';
import { AssessmentStatus } from '../../enums/assessment.status';
import { Role } from 'src/enums/role';
import { Roles } from 'src/guards/roles.decorator';
import { AssessmentStatusCountRespDto } from './dto/response/assessment-status-count.res.dto';
import { DuplicateAssessmentForOrganizationsReqDto } from './dto/request/duplicate-assessment-for-organizations.req.dto';

@ApiTags('Assessment')
@Controller('')
@Roles(Role.SUPERADMIN, Role.ADMIN, Role.MEMBER)
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  static rootRoute = 'assessment/';

  @ApiOperation({
    summary: 'Get list of assessments for organzation and status',
  })
  @ApiResponse(AssessmentResponseCodes.SUCCESS)
  @ApiResponse(AssessmentResponseCodes.BAD_REQUEST)
  @ApiResponse(AssessmentResponseCodes.INVALID_ASSESSMENT_ID)
  @ApiParam({ name: 'type', enum: AssessmentStatus })
  @HttpCode(200)
  @Get('organization/:id/' + AssessmentController.rootRoute + ':status')
  async getAllByOrganization(
    @Param('id', ParseIntPipe) id: number,
    @Param('status') type: AssessmentStatus,
  ) {
    return await this.assessmentService.getAllForOrganization(id, type);
  }

  @ApiOperation({ summary: 'Get assessment' })
  @ApiResponse({
    ...AssessmentResponseCodes.SUCCESS,
    type: AssessmentRespDto,
  })
  @ApiResponse(AssessmentResponseCodes.BAD_REQUEST)
  @ApiResponse(AssessmentResponseCodes.INVALID_ASSESSMENT_ID)
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.MEMBER, Role.CANDIDATE)
  @HttpCode(200)
  @Get(AssessmentController.rootRoute + ':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await this.assessmentService.getAssessmentById(id);
  }

  @ApiOperation({ summary: 'Get assessment by token' })
  @ApiResponse({
    ...AssessmentResponseCodes.SUCCESS,
    type: AssessmentRespDto,
  })
  @ApiResponse(AssessmentResponseCodes.BAD_REQUEST)
  @ApiResponse(AssessmentResponseCodes.INVALID_ASSESSMENT_TOKEN)
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.MEMBER, Role.CANDIDATE)
  @HttpCode(200)
  @Get(AssessmentController.rootRoute + 'token/:token')
  async getBYToken(@Param('token') token: string) {
    return await this.assessmentService.getAssessmentByToken(token);
  }

  @ApiOperation({ summary: 'Publish assessment' })
  @ApiResponse(AssessmentResponseCodes.SUCCESS)
  @ApiResponse(AssessmentResponseCodes.BAD_REQUEST)
  @ApiResponse(AssessmentResponseCodes.INVALID_ASSESSMENT_ID)
  @ApiResponse(AssessmentResponseCodes.ASSESSMENT_ACTION_DENIED)
  @ApiResponse(AssessmentResponseCodes.INVALID_ASSESSMENT_BLOCK_COUNT)
  @ApiResponse(AssessmentResponseCodes.INVALID_QUESTION_COUNT)
  @HttpCode(200)
  @Patch(AssessmentController.rootRoute + ':id/publish')
  async publish(@Param('id', ParseIntPipe) id: number) {
    return await this.assessmentService.publishAssessment(id);
  }

  @ApiOperation({ summary: 'Create assessment' })
  @ApiResponse({ ...AssessmentResponseCodes.CREATED, type: Number })
  @ApiResponse(AssessmentResponseCodes.BAD_REQUEST)
  @ApiResponse(AssessmentResponseCodes.INVALID_HEADER_FILE_ID)
  @ApiResponse(AssessmentResponseCodes.INVALID_ORGANIZATION_ID)
  @HttpCode(201)
  @Post(AssessmentController.rootRoute)
  async create(
    @Body()
    createAssessmentReqDto: AssessmentReqDto,
  ): Promise<number> {
    return await this.assessmentService.createAssessment(
      createAssessmentReqDto,
    );
  }

  @ApiOperation({ summary: 'Update assessment' })
  @ApiResponse(AssessmentResponseCodes.SUCCESS)
  @ApiResponse(AssessmentResponseCodes.BAD_REQUEST)
  @ApiResponse(AssessmentResponseCodes.INVALID_HEADER_FILE_ID)
  @ApiResponse(AssessmentResponseCodes.INVALID_ORGANIZATION_ID)
  @HttpCode(200)
  @Put(AssessmentController.rootRoute + ':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    assessmentDto: AssessmentReqDto,
  ) {
    return await this.assessmentService.updateAssessment(id, assessmentDto);
  }

  @ApiOperation({ summary: 'Delete assessment' })
  @ApiResponse(AssessmentResponseCodes.SUCCESS)
  @ApiResponse(AssessmentResponseCodes.BAD_REQUEST)
  @ApiResponse(AssessmentResponseCodes.INVALID_ASSESSMENT_ID)
  @HttpCode(200)
  @Delete(AssessmentController.rootRoute + ':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.assessmentService.deleteAssessment(id);
  }

  @ApiOperation({ summary: 'Activate assessment' })
  @ApiResponse(AssessmentResponseCodes.SUCCESS)
  @ApiResponse(AssessmentResponseCodes.BAD_REQUEST)
  @ApiResponse(AssessmentResponseCodes.INVALID_ASSESSMENT_ID)
  @HttpCode(200)
  @Patch(AssessmentController.rootRoute + ':id/activate')
  async activate(@Param('id', ParseIntPipe) id: number) {
    return await this.assessmentService.setAssessmentActive(id, true);
  }

  @ApiOperation({ summary: 'Deactivate assessment' })
  @ApiResponse(AssessmentResponseCodes.SUCCESS)
  @ApiResponse(AssessmentResponseCodes.BAD_REQUEST)
  @ApiResponse(AssessmentResponseCodes.INVALID_ASSESSMENT_ID)
  @HttpCode(200)
  @Patch(AssessmentController.rootRoute + ':id/deactivate')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    return await this.assessmentService.setAssessmentActive(id, false);
  }

  @ApiOperation({ summary: 'Duplicate assessment' })
  @ApiResponse(AssessmentResponseCodes.SUCCESS)
  @ApiResponse(AssessmentResponseCodes.BAD_REQUEST)
  @ApiResponse(AssessmentResponseCodes.INVALID_ASSESSMENT_ID)
  @HttpCode(201)
  @Post(AssessmentController.rootRoute + ':id/duplicate')
  async duplicate(@Param('id', ParseIntPipe) id: number) {
    return await this.assessmentService.duplicateAssessment(null, id);
  }

  @ApiOperation({
    summary: 'Search assessments by status and name for an organization',
  })
  @ApiResponse(AssessmentResponseCodes.SUCCESS)
  @ApiResponse(AssessmentResponseCodes.BAD_REQUEST)
  @ApiResponse(AssessmentResponseCodes.INVALID_ORGANIZATION_ID)
  @ApiResponse(AssessmentResponseCodes.INVALID_ASSESSMENT_STATUS)
  @HttpCode(200)
  @Get('organization/:organizationId/' + AssessmentController.rootRoute)
  async search(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Query('name') name: string,
    @Query('status') status: AssessmentStatus,
  ) {
    return await this.assessmentService.searchByStatusAndNameForOrganization(
      organizationId,
      name,
      status,
    );
  }

  @ApiOperation({
    summary: 'Get Assessment status count for an organization',
  })
  @ApiResponse(AssessmentResponseCodes.SUCCESS)
  @ApiResponse(AssessmentResponseCodes.BAD_REQUEST)
  @ApiResponse(AssessmentResponseCodes.INVALID_ORGANIZATION_ID)
  @HttpCode(200)
  @Get(
    'organization/:organizationId/' +
      AssessmentController.rootRoute +
      'status/count',
  )
  async getAssessmentStatusCount(
    @Param('organizationId', ParseIntPipe) organizationId: number,
  ): Promise<AssessmentStatusCountRespDto> {
    return await this.assessmentService.getAssessmentStatusCount(
      organizationId,
    );
  }

  @ApiOperation({ summary: 'Duplicate assessment for organizations' })
  @ApiResponse(AssessmentResponseCodes.SUCCESS)
  @ApiResponse(AssessmentResponseCodes.INVALID_ASSESSMENT_ID)
  @ApiResponse(AssessmentResponseCodes.INVALID_ORGANIZATION_ID)
  @Roles(Role.SUPERADMIN)
  @HttpCode(201)
  @Post(AssessmentController.rootRoute + 'duplicate')
  async duplicateAssessmentAtOrganizationLevel(
    @Body()
    duplicateAssessmentForOrganizationsReqDto: DuplicateAssessmentForOrganizationsReqDto,
  ) {
    return this.assessmentService.duplicateAssessmentForOrganizations(
      duplicateAssessmentForOrganizationsReqDto,
    );
  }
}
