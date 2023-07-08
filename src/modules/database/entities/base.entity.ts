import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('base')
export default class Base {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt?: Date | string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt?: Date | string;
}
