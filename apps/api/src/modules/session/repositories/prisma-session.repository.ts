import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { NewSessionEntity, SessionEntity } from '../entities/session.entity';
import { SessionRepository } from './session.repository';

@Injectable()
export class PrismaSessionRepository implements SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<SessionEntity[]> {
    const sessions = await this.prisma.session.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return sessions.map((session) => this.toEntity(session));
  }

  async findById(id: string): Promise<SessionEntity | null> {
    const session = await this.prisma.session.findUnique({ where: { id } });
    if (session == null) {
      return null;
    }

    return this.toEntity(session);
  }

  async create(input: NewSessionEntity): Promise<SessionEntity> {
    const session = await this.prisma.session.create({
      data: {
        startedAt: input.startedAt,
      },
    });

    return this.toEntity(session);
  }

  async endSession(
    sessionId: string,
    endedAt: Date,
  ): Promise<SessionEntity | null> {
    const updateResult = await this.prisma.session.updateMany({
      where: {
        id: sessionId,
        endedAt: null,
      },
      data: { endedAt },
    });

    if (updateResult.count === 0) {
      return null;
    }

    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (session == null) {
      return null;
    }

    return this.toEntity(session);
  }

  private toEntity(session: {
    id: string;
    createdAt: Date;
    startedAt: Date;
    endedAt: Date | null;
  }): SessionEntity {
    return {
      id: session.id,
      createdAt: session.createdAt.toISOString(),
      startedAt: session.startedAt.toISOString(),
      endedAt: session.endedAt?.toISOString() ?? null,
    };
  }
}
