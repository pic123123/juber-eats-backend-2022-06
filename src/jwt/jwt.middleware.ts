import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { JWTInput } from 'src/common/dtos/core.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { UserService } from 'src/users/users.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}
  async use(req: Request<null, null, JWTInput>, res: Response, next: NextFunction) {
    if ('jwt' in req.cookies) {
      const token = req.cookies['jwt'];
      try {
        const jwtPayload = this.jwtService.verify(token.toString());

        const { user } = await this.userService.userFindOne(jwtPayload.userId);

        if (user === undefined) {
          throw new HttpException(
            {
              success: false,
              message: `인증에 실패하였습니다.(1)`,
            },
            HttpStatus.FORBIDDEN,
          );
        }
        req.body.userId = user.id;
        req.body.email = user.email;

        next();
      } catch (e) {
        throw new HttpException(
          {
            success: false,
            message: `${e.message} (2)`,
          },
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      throw new HttpException(
        {
          success: false,
          message: `인증에 실패하였습니다. 인증정보를 전송해 주시기 바랍니다.(3)`,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
