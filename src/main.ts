import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const allowlist = [`http://localhost:3000`]; //프론트 주소

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: allowlist, // 허락하고자 하는 요청 주소
    credentials: true, // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.이거없으면 cors걸림
  });

  await app.listen(6878);
}
bootstrap();
