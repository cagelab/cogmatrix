import { NewSessionEntity, SessionEntity } from '../entities/session.entity';

export interface SessionRepository {
  list(): Promise<SessionEntity[]>;
  findById(id: string): Promise<SessionEntity | null>;
  create(input: NewSessionEntity): Promise<SessionEntity>;
  endSession(sessionId: string, endedAt: Date): Promise<SessionEntity | null>;
}
