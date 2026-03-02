import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import type { SessionEntity } from '../entities/session.entity';

@ObjectType('Session')
export class SessionType {
  @Field(() => ID)
  id!: string;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  startedAt!: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  endedAt!: Date | null;

  static fromEntity(entity: SessionEntity): SessionType {
    const type = new SessionType();
    type.id = entity.id;
    type.createdAt = new Date(entity.createdAt);
    type.startedAt = new Date(entity.startedAt);
    type.endedAt = entity.endedAt == null ? null : new Date(entity.endedAt);
    return type;
  }
}
