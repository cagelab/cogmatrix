import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import type { NewSessionEntity } from './../src/modules/session/entities/session.entity';
import type { SessionEntity } from './../src/modules/session/entities/session.entity';
import type { SessionRepository } from './../src/modules/session/repositories/session.repository';
import { SessionResolver } from './../src/modules/session/session.resolver';
import { SessionService } from './../src/modules/session/session.service';
import { SESSION_REPOSITORY } from './../src/modules/session/session.tokens';

describe('Session GraphQL (e2e)', () => {
  let app: INestApplication;

  afterEach(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const sessions: SessionEntity[] = [];
    const sessionRepository: SessionRepository = {
      async list(): Promise<SessionEntity[]> {
        return [...sessions].sort(
          (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
        );
      },
      async findById(id: string): Promise<SessionEntity | null> {
        return sessions.find((session) => session.id === id) ?? null;
      },
      async create(input: NewSessionEntity): Promise<SessionEntity> {
        const created: SessionEntity = {
          id: randomUUID(),
          createdAt: new Date().toISOString(),
          startedAt: input.startedAt.toISOString(),
          endedAt: null,
        };

        sessions.push(created);

        return created;
      },
      async endSession(
        sessionId: string,
        endedAt: Date,
      ): Promise<SessionEntity | null> {
        const index = sessions.findIndex((session) => session.id === sessionId);
        if (index < 0) {
          return null;
        }

        if (sessions[index].endedAt != null) {
          return null;
        }

        const updated: SessionEntity = {
          ...sessions[index],
          endedAt: endedAt.toISOString(),
        };

        sessions[index] = updated;

        return updated;
      },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: true,
        }),
      ],
      providers: [
        SessionResolver,
        SessionService,
        {
          provide: SESSION_REPOSITORY,
          useValue: sessionRepository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  it('createSession mutation', async () => {
    const payload = {
      startedAt: '2026-03-01T08:00:00.000Z',
    };
    const mutation = `
      mutation CreateSession($input: CreateSessionDto!) {
        createSession(input: $input) {
          id
          createdAt
          startedAt
          endedAt
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: mutation,
        variables: { input: payload },
      })
      .expect(200);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.createSession).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        createdAt: expect.any(String),
        startedAt: payload.startedAt,
        endedAt: null,
      }),
    );
  });

  it('sessions query', async () => {
    const createMutation = `
      mutation CreateSession($input: CreateSessionDto!) {
        createSession(input: $input) {
          id
        }
      }
    `;
    const sessionsQuery = `
      query {
        sessions {
          id
          createdAt
          startedAt
          endedAt
        }
      }
    `;

    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: createMutation,
        variables: {
          input: {
            startedAt: '2026-03-01T08:00:00.000Z',
          },
        },
      })
      .expect(200);

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: sessionsQuery })
      .expect(200);

    expect(response.body.errors).toBeUndefined();
    expect(Array.isArray(response.body.data.sessions)).toBe(true);
    expect(response.body.data.sessions.length).toBe(1);
    expect(response.body.data.sessions[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        createdAt: expect.any(String),
        startedAt: '2026-03-01T08:00:00.000Z',
        endedAt: null,
      }),
    );
  });

  it('endSession mutation', async () => {
    const createMutation = `
      mutation CreateSession($input: CreateSessionDto!) {
        createSession(input: $input) {
          id
        }
      }
    `;
    const endMutation = `
      mutation EndSession($input: EndSessionDto!) {
        endSession(input: $input) {
          id
          endedAt
        }
      }
    `;

    const createResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: createMutation,
        variables: {
          input: {
            startedAt: '2026-03-01T08:00:00.000Z',
          },
        },
      })
      .expect(200);

    const sessionId = createResponse.body.data.createSession.id as string;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: endMutation,
        variables: {
          input: {
            sessionId,
            endedAt: '2026-03-01T09:00:00.000Z',
          },
        },
      })
      .expect(200);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.endSession).toEqual(
      expect.objectContaining({
        id: sessionId,
        endedAt: '2026-03-01T09:00:00.000Z',
      }),
    );
  });

  it('endSession returns GraphQL error for invalid range', async () => {
    const createMutation = `
      mutation CreateSession($input: CreateSessionDto!) {
        createSession(input: $input) {
          id
        }
      }
    `;
    const createResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: createMutation,
        variables: {
          input: {
            startedAt: '2026-03-01T09:00:00.000Z',
          },
        },
      })
      .expect(200);

    const sessionId = createResponse.body.data.createSession.id as string;

    const mutation = `
      mutation EndSession($input: EndSessionDto!) {
        endSession(input: $input) {
          id
        }
      }
    `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: mutation,
        variables: {
          input: {
            sessionId,
            endedAt: '2026-03-01T08:00:00.000Z',
          },
        },
      })
      .expect(200)
      .expect((response) => {
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toContain(
          'endedAt must be later than startedAt',
        );
      });
  });

  it('endSession rejects duplicate end requests', async () => {
    const createMutation = `
      mutation CreateSession($input: CreateSessionDto!) {
        createSession(input: $input) {
          id
        }
      }
    `;
    const endMutation = `
      mutation EndSession($input: EndSessionDto!) {
        endSession(input: $input) {
          id
        }
      }
    `;

    const createResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: createMutation,
        variables: {
          input: {
            startedAt: '2026-03-01T08:00:00.000Z',
          },
        },
      })
      .expect(200);

    const sessionId = createResponse.body.data.createSession.id as string;

    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: endMutation,
        variables: {
          input: {
            sessionId,
            endedAt: '2026-03-01T09:00:00.000Z',
          },
        },
      })
      .expect(200);

    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: endMutation,
        variables: {
          input: {
            sessionId,
            endedAt: '2026-03-01T10:00:00.000Z',
          },
        },
      })
      .expect(200)
      .expect((response) => {
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toContain(
          'session already ended',
        );
      });
  });

  it('createSession returns GraphQL error for invalid ISO date', () => {
    const mutation = `
      mutation CreateSession($input: CreateSessionDto!) {
        createSession(input: $input) {
          id
        }
      }
    `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: mutation,
        variables: {
          input: {
            startedAt: 'invalid-date',
          },
        },
      })
      .expect(200)
      .expect((response) => {
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toContain(
          'Bad Request Exception',
        );
      });
  });
});
