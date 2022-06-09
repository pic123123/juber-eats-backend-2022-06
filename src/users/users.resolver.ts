import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/users.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  //Resolver에는 Query가 빈 쿼리라도 없으면 에러난다. mutation만 있으면 안됨
  @Query(() => String)
  sayHello(): string {
    return this.userService.getHello();
  }
}
