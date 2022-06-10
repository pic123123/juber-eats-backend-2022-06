import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountInput } from 'src/users/dtos/create-account.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createAccount({ email, password, role }: CreateAccountInput) {
    // check new user
    // create user & hash the password
    try {
      const exists = await this.users.findOne({ email });
    } catch (e) {
      console.log(e);
    }
  }
}
