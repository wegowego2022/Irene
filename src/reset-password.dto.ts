import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ description: 'The password reset token' })
  token: string;

  @ApiProperty({ description: 'The new password' })
  newPassword: string;
}
