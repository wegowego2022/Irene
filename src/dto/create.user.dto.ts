import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: '사용자의 이메일 주소',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  userId: string;

  @ApiProperty({
    description: '사용자의 별명',
    example: 'johnDoe',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  nickName?: string;

  @ApiProperty({
    description: '사용자의 비밀번호',
    example: 'password123',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  password?: string;

  @ApiProperty({
    description: '사용자 상태',
    example: 'active',
  })
  @IsNotEmpty()
  @IsString()
  status: string;
}
