import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn()
  userIdx: number;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'test0@gmail.com',
    description: '이메일',
  })
  userId: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'nickname',
    description: '닉네임',
  })
  nickName: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'password 122',
    description: '비밀번호',
  })
  password: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column()
  status: string;
}
