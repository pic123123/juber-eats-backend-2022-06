import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

enum UserRole {
  Owner,
  Client,
  Delivery,
}

registerEnumType(UserRole, { name: 'UserRole' });
@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column({ comment: '이메일 주소' })
  @Field((type) => String)
  email: string;

  @Column({ comment: '비밀번호' })
  @Field((type) => String)
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    comment: 'Owner:0, Client:1, Delivery:2',
  })
  @Field((type) => UserRole)
  role: UserRole;
}
