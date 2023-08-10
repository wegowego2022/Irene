import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/dto/create.user.dto';
import { OAuth2Client } from 'google-auth-library';
import { Response } from 'express';
import { Users } from 'src/users/Users';
import { UserLoginDto } from 'src/dto/login.user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userId: string, password: string): Promise<any> {
    const user = await this.usersService.getUser(userId);
    if (!user) throw new UnauthorizedException();
    const isCorrectPassword = bcrypt.compareSync(password, user.password);
    if (!isCorrectPassword) throw new UnauthorizedException();
    return user;
  }

  async register(userDto: CreateUserDto): Promise<any> {
    const createdUser = await this.usersService.createUser(userDto);
    return { ...createdUser, password: undefined };
  }

  async login(userLoginDto: UserLoginDto) {
    return this.usersService.loginUser(userLoginDto);
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findUserByUserId(payload.userId);
      if (!user) {
        throw new UnauthorizedException();
      }
      return {
        access_token: this.jwtService.sign({
          userId: user.userId,
          sub: user.userId,
        }),
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private async validateAndLoginByEmail(
    email: string,
  ): Promise<{ access_token: string; refresh_token: string; user: Users }> {
    let user = await this.usersService.findUserByUserId(email);
    if (!user) {
      const newUser: CreateUserDto = {
        userId: email,
        status: 'Active',
        nickName: 'nickname',
      };
      user = await this.usersService.createUser(newUser);
    }

    const jwtPayload = { userId: user.userId, sub: user.userId };
    const access_token = this.jwtService.sign(jwtPayload);
    const refresh_token = this.jwtService.sign(jwtPayload, { expiresIn: '7d' });

    return {
      access_token,
      refresh_token,
      user,
    };
  }

  async googleSigninWithToken(
    idToken: string,
  ): Promise<{ access_token: string; refresh_token: string; user: Users }> {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const email = payload.email as string;

      return this.validateAndLoginByEmail(email);
    } catch (err) {
      throw new UnauthorizedException('Invalid idToken');
    }
  }

  async googleSigninWithProfile(
    req: any,
  ): Promise<{ access_token: string; refresh_token: string; user: Users }> {
    if (!req.user) {
      throw new UnauthorizedException('No user from google');
    }
    const { email } = req.user;
    return this.validateAndLoginByEmail(email);
  }

  // async googleSignin(
  //   idToken: string,
  // ): Promise<{ access_token: string; refresh_token: string; user: Users }> {
  //   const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  //   try {
  //     const ticket = await client.verifyIdToken({
  //       idToken,
  //       audience: process.env.GOOGLE_CLIENT_ID,
  //     });
  //     const payload = ticket.getPayload();
  //     const email = payload.email as string;

  //     let user = await this.usersService.findUserByUserId(email);
  //     if (!user) {
  //       const newUser: CreateUserDto = {
  //         userId: email,
  //         status: 'A, 200',
  //         nickName: 'nickname',
  //       };
  //       user = await this.usersService.createUser(newUser);
  //     }

  //     const jwtPayload = { userId: user.userId, sub: user.userId };
  //     const access_token = this.jwtService.sign(jwtPayload);
  //     const refresh_token = this.jwtService.sign(jwtPayload, {
  //       expiresIn: '7d',
  //     });

  //     return {
  //       access_token,
  //       refresh_token,
  //       user,
  //     };
  //   } catch (err) {
  //     throw new UnauthorizedException('Invalid idToken');
  //   }
  // }

  // async googleLogin(
  //   req: any,
  // ): Promise<{ access_token: string; refresh_token: string; user: Users }> {
  //   if (!req.user) {
  //     throw new UnauthorizedException('No user from google');
  //   }

  //   const { email } = req.user;

  //   let user = await this.usersService.getUser(email);
  //   if (!user) {
  //     const newUser: CreateUserDto = {
  //       userId: email,
  //       status: 'A, 200',
  //       nickName: 'nickname',
  //     };
  //     user = await this.usersService.createUser(newUser);
  //   }

  //   const jwtPayload = { userId: user.userId, sub: user.userId };
  //   const access_token = this.jwtService.sign(jwtPayload);
  //   const refresh_token = this.jwtService.sign(jwtPayload, { expiresIn: '7d' });

  //   return {
  //     access_token,
  //     refresh_token,
  //     user,
  //   };
  // }
  async validateGoogleIdToken(idToken: string): Promise<any> {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const email = payload.email as string;

      const user = await this.usersService.findUserByUserId(email);
      if (!user) {
        throw new UnauthorizedException('Invalid Google user');
      }

      const jwtPayload = { userId: user.userId, sub: user.userId };
      const access_token = this.jwtService.sign(jwtPayload);
      const refresh_token = this.jwtService.sign(jwtPayload, {
        expiresIn: '7d',
      });

      return {
        access_token,
        refresh_token,
        user,
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid idToken');
    }
  }
}
