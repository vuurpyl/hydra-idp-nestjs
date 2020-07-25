import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PasswordTransformer } from './password.transformer';
import { Exclude } from 'class-transformer';
import { IsString } from 'class-validator';

@Entity({
  name: 'users',
})
export class User {

  @Column({ unique: true })
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column({
    name: 'password',
    transformer: new PasswordTransformer(),
  })
  password: string;

  @Column({ name: 'confirmation_token', nullable: true })
  confirmationToken: string;

  @Column({ name: 'confirmation_sent_at', nullable: true })
  confirmationSentAt: Date;

  @Column({ name: 'confirmed_at', nullable: true })
  confirmedAt: Date;

  @Column({ name: 'reset_password_token', nullable: true })
  resetPasswordToken: string;

  @Column({ name: 'reset_password_sent_at', nullable: true })
  resetPasswordSentAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  createDates() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  updateDates() {
    this.updatedAt = new Date();
  }
}
