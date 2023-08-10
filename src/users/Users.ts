import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Users')
export class Users {
  @PrimaryGeneratedColumn()
  userIdx: number;

  @Column()
  userId: string;

  @Column()
  nickName: string;

  @Column()
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;
}
