import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tb_user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;
}