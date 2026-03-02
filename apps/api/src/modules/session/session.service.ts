import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { CreateSessionDto } from './dto/create-session.dto';
import type { EndSessionDto } from './dto/end-session.dto';
import type { SessionEntity } from './entities/session.entity';
import type { SessionRepository } from './repositories/session.repository';
import { SESSION_REPOSITORY } from './session.tokens';

@Injectable()
export class SessionService {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
  ) {}

  async list(): Promise<SessionEntity[]> {
    return this.sessionRepository.list();
  }

  async create(input: CreateSessionDto): Promise<SessionEntity> {
    const { startedAt } = input;
    return this.sessionRepository.create({ startedAt });
  }

  async endSession(input: EndSessionDto): Promise<SessionEntity> {
    const existingSession = await this.sessionRepository.findById(
      input.sessionId,
    );

    if (existingSession == null) {
      throw new NotFoundException('session not found');
    }

    if (existingSession.endedAt != null) {
      throw new ConflictException('session already ended');
    }

    if (input.endedAt <= new Date(existingSession.startedAt)) {
      throw new BadRequestException('endedAt must be later than startedAt');
    }

    const updatedSession = await this.sessionRepository.endSession(
      input.sessionId,
      input.endedAt,
    );

    if (updatedSession == null) {
      throw new ConflictException('session already ended');
    }

    return updatedSession;
  }
}
