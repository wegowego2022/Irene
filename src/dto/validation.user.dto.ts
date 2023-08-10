import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidationUserDto {
  @ApiProperty({
    description: '유효성 검사를 위한 ID 토큰',
    example: 'exampleIdToken',
  })
  @IsNotEmpty()
  @IsString()
  idToken: string;
}
