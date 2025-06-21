import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/enums/role';
import { Roles } from 'src/guards/roles.decorator';
import { AssessmentBlockResponseCodes } from './assessment-block.response.codes';
import { AssessmentBlockService } from './assessment-block.service';
import { AssessmentBlockReqDto } from './dto/request/assessment-block.req.dto';
import { ReorderReqDto } from './dto/request/reorder.req.dto';
import { AssessmentBlockRespDto } from './dto/response/assessment-block.resp.dto';

@Controller('')
@Roles(Role.SUPERADMIN, Role.ADMIN, Role.MEMBER)
@ApiTags('Assessment-block')
export class AssessmentBlockController {
  static rootRoute = 'assessment-block/';

  constructor(
    private readonly assessmentBlockService: AssessmentBlockService,
  ) {}

  @ApiOperation({ summary: 'Get assessment blocks for assessment' })
  @ApiResponse({
    ...AssessmentBlockResponseCodes.SUCCESS,
    type: AssessmentBlockRespDto,
  })
  @ApiResponse(AssessmentBlockResponseCodes.BAD_REQUEST)
  @ApiResponse(AssessmentBlockResponseCodes.INVALID_ASSESSMENT_ID)
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.MEMBER, Role.CANDIDATE)
  @HttpCode(200)
  @Get('assessment/:id/' + AssessmentBlockController.rootRoute)
  async getAll(@Param('id') id: string): Promise<AssessmentBlockRespDto[]> {
    return await this.assessmentBlockService.getAllByAssessmentId(id);
  }

  @ApiOperation({ summary: 'Get assessment block' })
  @ApiResponse(AssessmentBlockResponseCodes.SUCCESS)
  @ApiResponse(AssessmentBlockResponseCodes.BAD_REQUEST)
  @ApiResponse(AssessmentBlockResponseCodes.INVALID_ASSESSMENT_BLOCK_ID)
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.MEMBER, Role.CANDIDATE)
  @HttpCode(200)
  @Get(AssessmentBlockController.rootRoute + ':id')
  async get(@Param('id') id: string) {
    return await this.assessmentBlockService.getAssessmentBlockById(id);
  }

  @ApiOperation({ summary: 'Create an assessment block' })
  @ApiResponse(AssessmentBlockResponseCodes.SUCCESS)
  @ApiResponse(AssessmentBlockResponseCodes.BAD_REQUEST)
  @ApiResponse(AssessmentBlockResponseCodes.INVALID_ASSESSMENT_ID)
  @ApiResponse(AssessmentBlockResponseCodes.ASSESSMENT_ACTION_DENIED)
  @HttpCode(201)
  @Post('assessment/:id/' + AssessmentBlockController.rootRoute)
  async create(
    @Param('id') id: string,
    @Body() createAssessmentBlockReqDto: AssessmentBlockReqDto,
  ): Promise<number> {
    return await this.assessmentBlockService.createAssessmentBlock(
      id,
      createAssessmentBlockReqDto,
    );
  }

  @ApiOperation({ summary: 'Update an assessment block' })
  @ApiResponse(AssessmentBlockResponseCodes.SUCCESS)
  @ApiResponse(AssessmentBlockResponseCodes.BAD_REQUEST)
  @ApiResponse(AssessmentBlockResponseCodes.INVALID_ASSESSMENT_BLOCK_ID)
  @ApiResponse(AssessmentBlockResponseCodes.ASSESSMENT_ACTION_DENIED)
  @ApiResponse(AssessmentBlockResponseCodes.ASSESSMENT_BLOCK_ACTION_DENIED)
  @HttpCode(200)
  @Put(AssessmentBlockController.rootRoute + ':id')
  async update(
    @Param('id') id: string,
    @Body() updateAssessmentBlockReqDto: AssessmentBlockReqDto,
  ) {
    return await this.assessmentBlockService.updateAssessmentBlock(
      id,
      updateAssessmentBlockReqDto,
    );
  }

  @ApiOperation({ summary: 'Reorder assessment blocks' })
  @ApiResponse(AssessmentBlockResponseCodes.SUCCESS)
  @ApiResponse(AssessmentBlockResponseCodes.BAD_REQUEST)
  @ApiResponse(AssessmentBlockResponseCodes.INVALID_ASSESSMENT_ID)
  @ApiResponse(AssessmentBlockResponseCodes.ASSESSMENT_ACTION_DENIED)
  @ApiResponse(AssessmentBlockResponseCodes.INVALID_ASSESSMENT_BLOCK_ID_LIST)
  @HttpCode(200)
  @Patch('assessment/:id/' + AssessmentBlockController.rootRoute + 'reorder')
  async reorder(@Param('id') id: string, @Body() reorderReqDto: ReorderReqDto) {
    return await this.assessmentBlockService.reorderAssessmentBlock(
      id,
      reorderReqDto,
    );
  }

  @ApiOperation({ summary: 'Delete assessment block' })
  @ApiResponse(AssessmentBlockResponseCodes.SUCCESS)
  @ApiResponse(AssessmentBlockResponseCodes.BAD_REQUEST)
  @ApiResponse(AssessmentBlockResponseCodes.INVALID_ASSESSMENT_BLOCK_ID)
  @ApiResponse(AssessmentBlockResponseCodes.ASSESSMENT_ACTION_DENIED)
  @HttpCode(200)
  @Delete(AssessmentBlockController.rootRoute + ':id')
  async delete(@Param('id') id: string) {
    return await this.assessmentBlockService.deleteAssessmentBlock(id);
  }
}
