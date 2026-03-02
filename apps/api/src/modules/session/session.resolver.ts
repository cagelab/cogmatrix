import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateSessionDto } from './dto/create-session.dto';
import { EndSessionDto } from './dto/end-session.dto';
import { SessionService } from './session.service';
import { SessionType } from './graphql/session.type';

@Resolver(() => SessionType)
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  @Query(() => [SessionType], { name: 'sessions' })
  async list(): Promise<SessionType[]> {
    const sessions = await this.sessionService.list();
    return sessions.map(SessionType.fromEntity);
  }

  @Mutation(() => SessionType)
  async createSession(
    @Args('input') input: CreateSessionDto,
  ): Promise<SessionType> {
    const session = await this.sessionService.create(input);
    return SessionType.fromEntity(session);
  }

  @Mutation(() => SessionType)
  async endSession(@Args('input') input: EndSessionDto): Promise<SessionType> {
    const session = await this.sessionService.endSession(input);
    return SessionType.fromEntity(session);
  }
}
