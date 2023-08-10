// auth/auth.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { JwtStrategy } from './auth.jwt.strategy';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './auth.google.strategy';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  exports: [AuthService],
  providers: [JwtStrategy, AuthService, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
