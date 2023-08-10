// src/auth/auth.controller.ts

import {
  Controller,
  Get,
  UseGuards,
  Req,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { Request, Response } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

interface IOAuthUser {
  user: {
    name: string;
    email: string;
  };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersSvice: UsersService,
    private readonly authService: AuthService,
  ) {}

  // @Get('/login/google')
  // @UseGuards(AuthGuard('google'))
  // async loginGoogle(@Req() req: Request & IOAuthUser, @Req() res: Response) {
  //   // 프로필 받고, 로그인 처리
  //   this.authService.googleLogin({ req, res });
  // }
  // googleLogin() {}
  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google 로그인' })
  @ApiResponse({ status: 200, description: 'Google 로그인 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async loginGoogle(@Req() req: Request & IOAuthUser, @Req() res: Response) {
    // 프로필 받고, 로그인 처리
    return this.authService.googleSigninWithProfile(req);
  }
  @Get('/callback/google')
  @ApiOperation({ summary: 'google 로그인 콜백 ' })
  @ApiQuery({ name: 'idtoken', description: 'Google에서 제공하는 id 토큰' })
  @ApiResponse({ status: 200, description: '로그인 성공 및 사용자 정보 반환' })
  @ApiResponse({ status: 401, description: 'Invalid idToken' })
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request) {
    // idToken을 추출합니다.
    const idToken = req.query.idtoken as string;

    // 받은 idToken을 서비스로 전달하여 검증하고 로그인 처리
    const validatedUser = await this.authService.googleSigninWithToken(idToken);

    if (validatedUser) {
      // 검증된 사용자 정보를 사용하여 추가적인 로그인 처리를 수행하고
      // JWT 토큰을 생성하거나 사용자 정보를 반환합니다.
      return validatedUser;
    } else {
      // 유효하지 않은 idToken이거나 검증 실패 시 처리
      throw new UnauthorizedException('Invalid idToken');
    }
  }
  // @Get('/callback/google')
  // @ApiOperation({ summary: 'google 로그인 콜백 ' })
  // @UseGuards(AuthGuard('google'))
  // async googleAuthCallback(@Req() req: Request) {
  //   // Google Strategy에서 사용자 정보를 받아온다.
  //   const user = req.user;

  //   // idToken을 추출합니다.
  //   const idToken = req.query.idtoken as string;

  //   // 받은 idToken을 서비스로 전달하여 검증하고 로그인 처리
  //   const validatedUser = await this.authService.validateGoogleIdToken(idToken);

  //   if (validatedUser) {
  //     // 검증된 사용자 정보를 사용하여 추가적인 로그인 처리를 수행하고
  //     // JWT 토큰을 생성하거나 사용자 정보를 반환합니다.
  //     return validatedUser;
  //   } else {
  //     // 유효하지 않은 idToken이거나 검증 실패 시 처리
  //     // 예를 들어 에러 메시지를 반환하거나 로그인 실패 페이지로 리다이렉트할 수 있습니다.
  //     throw new Error('Invalid idToken');
  //   }

  @UseGuards(AuthGuard('local'))
  @Post('local')
  @ApiOperation({ summary: 'Local 로그인' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Local 로그인 성공 및 사용자 정보 반환',
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async login(@Req() req) {
    return req.user;
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({ summary: 'Kakao 로그인' })
  @ApiResponse({ status: 200, description: 'Kakao 로그인 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  kakaoLogin() {
    // initiates the Google OAuth2 login flow
  }

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({ summary: 'Kakao 로그인 콜백' })
  @ApiResponse({
    status: 200,
    description: 'Kakao 로그인 성공 및 사용자 정보 반환',
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  kakaoLoginCallback(@Req() req) {
    // handles the Google OAuth2 callback
    const user = req.user;
    // 여기서 JWT 토큰을 생성하고, 해당 토큰을 이용해 사용자를 인증할 수 있습니다.
  }

  // @Get()
  // @UseGuards(AuthGuard('google'))
  // async googleAuth(@Req() req) {}

  // @Get('redirect')
  // @UseGuards(AuthGuard('google'))
  // googleAuthRediredct(@Req() req) {
  //   return this.authService.googleLogin(req);
}
