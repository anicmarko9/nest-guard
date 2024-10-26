import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, Index } from 'typeorm';

import { User } from '@Users/entities/user.entity';

@Entity({ name: 'tokens' })
@Index('IDX_Token_verify', ['verifyToken'])
@Index('IDX_Token_password', ['passwordToken'])
@Index('IDX_Token_invite', ['inviteToken'])
export class Token {
  @PrimaryColumn({ name: 'id', type: 'uuid', primaryKeyConstraintName: 'PK_Token' })
  id: string;

  @Column({ name: 'verified', type: 'boolean', default: false })
  verified: boolean;

  @Column({ name: 'verify_token', type: 'varchar', nullable: true })
  verifyToken: string | null;

  @Column({ name: 'password_token', type: 'varchar', nullable: true })
  passwordToken: string | null;

  @Column({ name: 'invite_token', type: 'varchar', nullable: true })
  inviteToken: string | null;

  @OneToOne(() => User, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id', referencedColumnName: 'id', foreignKeyConstraintName: 'FK_Token_User' })
  user: User;
}
