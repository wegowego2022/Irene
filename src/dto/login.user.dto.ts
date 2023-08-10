import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({
    description: '로그인할 사용자의 이메일 주소',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  userId: string;

  @ApiProperty({
    description: '로그인할 사용자의 비밀번호',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
