import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { PrismaSessionRepository } from './repositories/prisma-session.repository';
import { SessionResolver } from './session.resolver';
import { SessionService } from './session.service';
import { SESSION_REPOSITORY } from './session.tokens';

@Module({
  imports: [PrismaModule],
  providers: [
    SessionResolver,
    SessionService,
    {
      provide: SESSION_REPOSITORY,
      useClass: PrismaSessionRepository,
    },
  ],
})
export class SessionModule {}
