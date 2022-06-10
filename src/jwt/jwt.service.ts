import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

interface IJwtPayload {
  /**
   * 회원 고유번호
   */
  userId: number;
  /**
   * 회원 이메일
   */
  email: string;
}

@Injectable()
export class JwtService {
  private readonly jwtSecretKey = process.env.JWT_SECRET_KEY;

  sign(payloadRaw: IJwtPayload): string {
    const payload = {
      ...payloadRaw,
      uuid4: uuidv4(),
    };
    const token = jwt.sign(payload, this.jwtSecretKey, {
      expiresIn: '24h',
      algorithm: 'HS512',
    });
    return token;
  }
  verify(token: string): IJwtPayload {
    try {
      const decodeData = jwt.verify(token, this.jwtSecretKey);

      const a = JSON.stringify(decodeData);
      const b = JSON.parse(a);
      return b;
    } catch (e) {
      // console.log(e.message);
      throw new HttpException(
        {
          success: false,
          message: `JWT 토큰이 만료되었습니다. 다시 로그인 해주시기 바랍니다.`,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
