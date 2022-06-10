import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';

///////////////////////////////////////////////////////////////

import { CommonModule } from 'src/common/common.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //어디서나 config module 접근 가능하게 함(global)
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : process.env.NODE_ENV === 'stag' ? '.env.stag' : '.env.prod',
      //스키마 유효성검사(환경 변수가 undefined이라던가 잘못된 값이 들어와서 왜 안되는지 고생해본 경험이 있으시다면 아주 유용할겁니다.)
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'stag', 'prod').required(), //NODE_ENV가 dev,prod가 아닐때 에러발생시킨다
        JWT_SECRET_KEY: Joi.string().required(),
        SALT: Joi.string().required(),
        JOKER_DB_HOST: Joi.string().required(),
        JOKER_DB_USERNAME: Joi.string().required(),
        JOKER_DB_PASSWORD: Joi.string().required(),
        JOKER_DB_DATABASE: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true, //스키마를 메모리에서 즉시 생성
      sortSchema: true, //스키마를 사전 순으로 정렬
      debug: true, //디버그 모드 끄고싶을때 false
      playground: true, //playground 끄고싶을때 false
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.JOKER_DB_HOST,
      port: 3306,
      username: process.env.JOKER_DB_USERNAME,
      password: process.env.JOKER_DB_PASSWORD,
      database: process.env.JOKER_DB_DATABASE,
      entities: [User],
      // synchronize: process.env.NODE_ENV === 'dev',
      logging: process.env.NODE_ENV === 'dev',
      extra: {
        waitForConnections: true, // 사용 가능한 연결이없고 한계에 도달했을 때 풀의 동작을 결정합니다. 그 경우 true, 풀은 접속 요구를 큐에 넣어, 이용 가능하게되었을 때에 접속 요구를 호출합니다. false의 경우 false, 풀은 즉시 에러로 콜백합니다. (기본값 : true)
        connectTimeout: 10000, // MySQL 서버에 처음 연결하는 동안 시간 초과가 발생하기 전의 밀리 초. (기본값 : 10000)
        queueLimit: 3000, // getConnection에서 오류를 반환하기 전에 풀에서 대기열에 넣을 최대 연결 요청 수입니다. 0으로 설정하면 대기 중인 연결 요청 수에 제한이 없습니다. (기본값: 0)
        connectionLimit: process.env.NODE_ENV === 'dev' ? 10 : 30, //한 번에 생성할 최대 연결 수. (기본값: 10)
      },
    }),
    CommonModule,
    UsersModule,
    JwtModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
