import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/core.dto';
import { User } from 'src/users/entities/user.entity';

@InputType()
export class CreateAccountInput extends PickType(User, ['email', 'password', 'role']) {}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {}

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginOutput extends CoreOutput {}
