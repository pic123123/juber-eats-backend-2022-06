import { Field, ObjectType } from '@nestjs/graphql';

/**
 * JWT 미들웨어 검증 후 전달 할 데이터
 */
export class JWTInput {
  /**
   * WakeUp 회원 고유번호
   * MemberEntity.id
   */
  userId!: number;

  /**
   * 이메일
   */
  email!: string;
}

@ObjectType()
export class CoreOutput {
  @Field((type) => String, { nullable: true })
  error?: string;
  @Field((type) => Boolean)
  ok: boolean;
}
