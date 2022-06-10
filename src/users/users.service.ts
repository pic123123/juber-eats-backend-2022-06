import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as Crypto from 'crypto';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as jwt from 'jsonwebtoken';
////////////

import { CreateAccountInput, CreateAccountOutput, LoginInput, LoginOutput } from 'src/users/dtos/user.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

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
      const token = await this.sign(user.id, user.email);
      console.log(token);
      return { ok: true };

      return { ok: true };
    } catch (e) {
      console.log(e);
      return { ok: false, error: '로그인에 실패하였습니다.' };
    }
  }

  async sign(id: number, email: string): Promise<string> {
    const payLoad = {
      id: id,
      email: email,
      uuid4: uuidv4(),
    };
    const token = jwt.sign(payLoad, process.env.JWT_SECRET_KEY, {
      expiresIn: '24h',
      algorithm: 'HS512',
    });
    return token;
  }

  async verify(token: string) {
    try {
      const decodeData = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log(decodeData);
      const a = JSON.stringify(decodeData);
      console.log(a);
      const b = JSON.parse(a);
      console.log(b);
      console.log(b.id);
      return b.id;
    } catch (e) {
      return {
        success: false,
        error: `JWT 토큰이 만료되었습니다. 다시 로그인 해주시기 바랍니다.`,
      };
    }
  }
}
