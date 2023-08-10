import {
  Body,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/users.entity';
import { Repository } from 'typeorm';
import { EmailService } from 'src/email/email.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserLoginDto } from 'src/dto/login.user.dto';
import { CreateUserDto } from 'src/dto/create.user.dto';

import { Users } from './Users';

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}
  async getUser(userId: string): Promise<User> {
    return await this.userRepository.findOne({ where: { userId: userId } });
  }

  // async createUser(user: User): Promise<User> {
  //   user.password = await bcrypt.hash(user.password, 10);
  //   const newUser = this.userRepository.create(user);
  //   await this.userRepository.save(newUser);
  //   return newUser;
  // }
  async createUser(userDto: CreateUserDto): Promise<User> {
    const user: User = this.userRepository.create(userDto);
    user.password = await bcrypt.hash(user.password, 10);
    await this.userRepository.save(user);
    return user;
  }
  async updateUser(user: User): Promise<User> {
    await this.userRepository.update(user.userId, user);
    const updatedUser = await this.userRepository.findOne({
      where: { userId: user.userId },
    });
    return updatedUser;
  }
  async loginUser(userLoginDto: UserLoginDto): Promise<LoginResponse> {
    const foundUser = await this.userRepository.findOne({
      where: { userId: userLoginDto.userId },
    });

    if (!foundUser) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    const isPasswordValid = await bcrypt.compare(
      userLoginDto.password,
      foundUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 올바르지 않습니다.');
    }

    const accessToken = jwt.sign(
      { userId: foundUser.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' },
    );
    const refreshToken = jwt.sign(
      { userId: foundUser.userId },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' },
    );

    return { user: foundUser, accessToken, refreshToken };
  }

  // async loginUser(userLoginDto: UserLoginDto): Promise<any> {
  //   const foundUser = await this.userRepository.findOne({
  //     where: { userId: userLoginDto.userId },
  //   });

  //   if (!foundUser) {
  //     throw new UnauthorizedException('존재하지 않는 사용자입니다.');
  //   }

  //   const isPasswordValid = await bcrypt.compare(
  //     userLoginDto.password,
  //     foundUser.password,
  //   );
  //   if (!isPasswordValid) {
  //     throw new UnauthorizedException('비밀번호가 올바르지 않습니다.');
  //   }

  //   const accessToken = jwt.sign(
  //     { userId: foundUser.userId },
  //     process.env.ACCESS_TOKEN_SECRET,
  //     { expiresIn: '1h' },
  //   );
  //   const refreshToken = jwt.sign(
  //     { userId: foundUser.userId },
  //     process.env.REFRESH_TOKEN_SECRET,
  //     { expiresIn: '1d' },
  //   );

  //   return { user: foundUser, accessToken, refreshToken };
  // }

  // async loginUser(userLoginDto: UserLoginDto): Promise<any> {
  //   const foundUser = await this.userRepository.findOne({
  //     where: { userId: userLoginDto.userId },
  //   });
  //   if (
  //     foundUser &&
  //     (await bcrypt.compare(userLoginDto.password, foundUser.password))
  //   ) {
  //     const accessToken = jwt.sign(
  //       { userId: foundUser.userId },
  //       process.env.ACCESS_TOKEN_SECRET,
  //       { expiresIn: '1h' },
  //     );
  //     const refreshToken = jwt.sign(
  //       { userId: foundUser.userId },
  //       process.env.REFRESH_TOKEN_SECRET,
  //       { expiresIn: '1d' },
  //     );
  //     return {
  //       status: 'success',
  //       message: '로그인 성공',
  //       data: {
  //         user: foundUser,
  //         accessToken: accessToken,
  //         refreshToken: refreshToken,
  //       },
  //     };
  //   } else {
  //     throw new UnauthorizedException('로그인 실패'); // NestJS의 예외 처리 메커니즘을 사용
  //   }
  // }

  async signupUser(user: Partial<User>): Promise<User> {
    const existingUser = await this.findUserByEmailOrNickName(
      user.userId,
      user.nickName,
    );
    if (existingUser) {
      throw new ConflictException('User or Nickname already exists');
    }

    user.password = await bcrypt.hash(user.password, 10);
    const newUser = this.userRepository.create(user);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async findUserByEmailOrNickName(
    userId: string,
    nickName: string,
  ): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: [{ userId: userId }, { nickName }],
    });
  }

  async findUserByUserId(userId: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { userId: userId } });
  }

  async findUserByUserIdx(userIdx: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { userIdx } });
  }

  async findUserByNickName(nickName: string): Promise<User> {
    return this.userRepository.findOne({ where: { nickName } });
  }

  async deleteUser(userIdx: number): Promise<void> {
    await this.userRepository.delete(userIdx);
  }

  async generateResetPasswordLink(email: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { userId: email },
    });

    if (!user) {
      throw new Error('No user found with this email.');
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    // Here we generate the reset link to be included in the email
    // TODO: Send the link via email to the user
    // The link should be something like `http://yourwebsite.com/reset-password?token=${token}`

    const resetLink = `http://yourwebsite.com/reset-password?token=${token}`;

    await this.emailService.sendEmail(
      email,
      'Password Reset',
      `Click on this link to reset your password: ${resetLink}`,
    );

    return token;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      throw new Error('Invalid or expired reset token.');
    }

    const user = await this.userRepository.findOne({
      where: { userId: decoded.userId },
    });

    if (!user) {
      throw new Error('User not found.');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
  }

  googleLogin(req) {
    if (!req.user) {
      return '401, No user from google';
    }
    return {
      statusCode: 200,
      message: '구글 로그인 성공',
      user: req.user,
    };
  }
}
