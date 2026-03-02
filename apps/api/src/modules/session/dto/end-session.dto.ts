import { Field, GraphQLISODateTime, ID, InputType } from '@nestjs/graphql';
import { IsDate, IsUUID } from 'class-validator';

@InputType()
export class EndSessionDto {
  @Field(() => ID)
  @IsUUID()
  sessionId!: string;

  @Field(() => GraphQLISODateTime)
  @IsDate()
  endedAt!: Date;
}
