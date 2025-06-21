import {
  HttpCode,
  Request,
  Delete,
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRespDto } from '../user/dto/response/user.resp.dto';
import { AuthResponseCodes } from './auth.response.codes';
import { AuthService } from './auth.service';
import { AuthReqDto } from './dto/request/auth.req.dto';
import { AuthRespDto } from './dto/response/auth.resp.dto';
import { Public } from './jwt-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ ...AuthResponseCodes.SUCCESS, type: UserRespDto })
  @ApiResponse(AuthResponseCodes.BAD_REQUEST)
  @ApiResponse(AuthResponseCodes.USER_CREDENTIALS_INVALID)
  @ApiResponse(AuthResponseCodes.USER_ACCOUNT_INACTIVE)
  @HttpCode(200)
  @Post('/login')
  @Public()
  async login(@Body() authReqDto: AuthReqDto): Promise<AuthRespDto> {
    return this.authService.loginUser(authReqDto);
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ ...AuthResponseCodes.SUCCESS })
  @ApiResponse(AuthResponseCodes.BAD_REQUEST)
  @ApiResponse(AuthResponseCodes.ACCESS_TOKEN_INVALID)
  @HttpCode(200)
  @Delete('/logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user);
  }
}
