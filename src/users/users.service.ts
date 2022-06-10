import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as Crypto from 'crypto';
import { Repository } from 'typeorm';
////////////

import { CreateAccountInput, CreateAccountOutput, LoginInput, LoginOutput, MemberFindOneServiceOutput } from 'src/users/dtos/user.dto';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class UserService {
  constructor(private readonly jwt: JwtService, @InjectRepository(User) private readonly users: Repository<User>) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createAccount({ email, password, role }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exists = await this.users.findOne({
        where: {
          email: email,
        },
      });
      if (exists) {
        return { ok: false, error: '이미 가입된 이메일 입니다.' };
      }

      const salt = process.env.SALT;
      const hashPassword = Crypto.createHash('sha512')
        .update(password + salt)
        .digest('base64');

      await this.users.save(this.users.create({ email, password: hashPassword, role }));
      return { ok: true };
    } catch (e) {
      console.log(e);
      return { ok: false, error: '회원가입에 실패하였습니다.' };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({
        where: {
          email: email,
        },
      });
      if (!user) {
        return { ok: false, error: '존재하지 않는 회원입니다.' };
      }
      const salt = process.env.SALT;
      const hashPassword = Crypto.createHash('sha512')
        .update(password + salt)
        .digest('base64');
      if (user.password !== hashPassword) {
        return { ok: false, error: '비밀번호가 틀렸습니다.' };
      }
      const payload = {
        userId: user.id,
        email: user.email,
      };
      const token = this.jwt.sign(payload);
      console.log(token);
      return { ok: true, token: token };
    } catch (e) {
      console.log(e);
      return { ok: false, error: '로그인에 실패하였습니다.' };
    }
  }

  async userFindOne(userId: number): Promise<MemberFindOneServiceOutput> {
    return {
      ok: true,
      user: await this.users.findOne({
        where: {
          id: userId,
        },
      }),
    };
  }
}
