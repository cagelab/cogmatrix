export interface SessionEntity {
  id: string;
  createdAt: string;
  startedAt: string;
  endedAt: string | null;
}

export interface NewSessionEntity {
  startedAt: Date;
}
