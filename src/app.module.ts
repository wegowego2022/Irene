import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { GoogleStrategy } from './auth/auth.google.strategy';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { Users } from './users/Users';
import { UsersModule } from './users/users.module';
import { User } from './entity/users.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User],
      synchronize: false,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    EmailModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, EmailService, GoogleStrategy, AuthService],
})
export class AppModule {}
