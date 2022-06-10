import { Field } from '@nestjs/graphql';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class CoreEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  @Field((type) => Date)
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field((type) => Date)
  updatedAt: Date;
}
