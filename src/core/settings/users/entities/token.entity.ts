import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'tokens' })
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
