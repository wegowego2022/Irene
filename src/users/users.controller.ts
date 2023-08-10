import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpCode,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { User } from 'src/entity/users.entity';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { ResetPasswordDto } from 'src/reset-password.dto';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/auth.jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  @ApiOperation({ summary: '사용자 정보 조회(프로필, 기타 설정 등)' })
  @ApiResponse({
    status: 200,
    description: 'User data retrieved successfully.',
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'User ID to retrieve data for',
  })
  get(@Param('userId') userId: string) {
    return this.userService.getUser(userId);
  }

  //회원가입(신규 유저 생성)
  @Post('/signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid user data provided.' })
  @ApiBody({ type: User, description: 'User data for registration' })
  create(@Body() user: User) {
    return this.userService.createUser(user);
  }

  // 일반 로그인
  @Post('/login')
  @ApiOperation({ summary: '일반 로그인' })
  @ApiResponse({ status: 200, description: 'User login successful.' })
  @ApiResponse({ status: 401, description: 'Invalid login credentials.' })
  @ApiBody({ type: User, description: 'User login credentials' })
  loginUser(@Body() user: User) {
    return this.userService.loginUser(user);
  }

  // 유저 데이터 업데이트
  @Put('/update')
  @ApiOperation({ summary: 'Update user data' })
  @ApiResponse({ status: 200, description: 'User data updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid user data provided.' })
  @ApiBody({ type: User, description: 'User data for update' })
  update(@Body() user: User) {
    return this.userService.updateUser(user);
  }

  // 유저삭제
  @Delete('/delete')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiParam({
    name: 'userIdx',
    required: true,
    description: 'The userIdx of the user to be deleted',
  })
  async deleteUser(@Param('userIdx') userIdx: number): Promise<void> {
    return this.userService.deleteUser(userIdx);
  }

  @Get()
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google authentication' })
  @ApiResponse({
    status: 200,
    description: 'Google authentication successful.',
  })
  async googleAuth(@Req() req) {
    return req;
  }

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google authentication redirect' })
  @ApiResponse({ status: 200, description: 'Google login successful.' })
  googleAuthRedirect(@Req() req) {
    return this.userService.googleLogin(req);
  }
}
