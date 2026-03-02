import { Field, GraphQLISODateTime, InputType } from '@nestjs/graphql';
import { IsDate } from 'class-validator';

@InputType()
export class CreateSessionDto {
  @Field(() => GraphQLISODateTime)
  @IsDate()
  startedAt!: Date;
}
